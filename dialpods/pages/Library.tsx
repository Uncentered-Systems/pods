import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Button,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import type {
  Podcast,
  RSSFeed,
  RSSFeedItem,
  YoutubeChannel,
  YoutubeItem,
} from '../logic/types/types';
import useUIStore from '../logic/store';
import {createStaticNavigation, useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {globalStyles} from '../styles.ts';
import FeedPage from './Feed.tsx';
import YTChannelPage from './YTChannel.tsx';
import {YTPlayerPage, RSSPlayerPage} from './Player.tsx';
import {parseRSSFull, parseXMLRes, parseYTFeed} from '../logic/utils.ts';
import Chip from '../components/Chip.tsx';
import Chips from '../components/Chip.tsx';

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export type LibraryStackParamList = {
  Library: undefined;
  YTChannel: {chan: YoutubeChannel};
  Feed: {feed: RSSFeed};
  YTPlayer: {ep: YoutubeItem};
  RSSPlayer: {ep: RSSFeedItem};
};
function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Library" component={LibraryPage} />
      <Stack.Screen name="YTChannel" component={YTChannelPage} />
      <Stack.Screen name="Feed" component={FeedPage} />
      <Stack.Screen name="YTPlayer" component={YTPlayerPage} />
      <Stack.Screen name="RSSPlayer" component={RSSPlayerPage} />
    </Stack.Navigator>
  );
}
// const LibraryStack = createNativeStackNavigator({
//   initialRouteName: 'Library',
//   screens: {
//     Library: LibraryPage,
//     Feed: FeedPage,
//     Player: PlayerPage,
//   },
// });

// const LibraryNav = createStaticNavigation(LibraryStack);

function LibraryPage() {
  const [selectedFilter, setSelectedFilter] = useState('All Categories');

  const filterChips = [
    'All Categories',
    'Playlists',
    'Podcasts',
    'Songs',
    'Albums',
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {subs, sync} = useUIStore(state => ({
    subs: state.subs,
    sync: state.sync,
  }));
  console.log(subs, 'subs @ home');

  if (loading) return <ActivityIndicator size={82} style={{margin: 'auto'}} />;
  else
    return (
      <View>
        <Chips
          chips={filterChips}
          select={setSelectedFilter}
          selected={selectedFilter}
        />
        <FlatList
          data={Object.values(subs)}
          keyExtractor={item => item.url}
          renderItem={item => (
            <FeedPreview
              setLoading={setLoading}
              setError={setError}
              feed={item.item}
            />
          )}></FlatList>
        {error && <Text style={globalStyles.error}>{error}</Text>}
      </View>
    );
}

function FeedPreview({
  feed,
  setLoading,
  setError,
}: {
  setLoading: (b: boolean) => void;
  setError: (t: string) => void;
  feed: Podcast;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<LibraryStackParamList>>();
  function handleError(s1: string, s2: string) {
    setError(`error: ${s2} on ${s1}`);
  }
  async function openFeedPage() {
    setLoading(true);
    const res = await fetch(feed.url);
    const html = await res.text();
    console.log('html', html);
    const doc = await parseXMLRes(html);
    if (feed.url.includes('youtube.com')) {
      const mparsed = parseYTFeed(doc);
      setLoading(false);
      if ('error' in mparsed) handleError(feed.url, mparsed.error);
      else navigation.navigate('YTChannel', {chan: mparsed.ok});
    } else {
      const mparsed = parseRSSFull(feed.url, doc);
      setLoading(false);
      if ('error' in mparsed) handleError(feed.url, mparsed.error);
      else navigation.navigate('Feed', {feed: mparsed.ok});
    }
  }

  return (
    <Pressable onPress={openFeedPage}>
      <View style={{...styles.preview, ...globalStyles.spreadRow}}>
        <Image source={{uri: feed.image}} style={styles.thumbnail} />
        <Text>{feed.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  preview: {height: 100, borderColor: 'green', borderWidth: 2},
  thumbnail: {
    height: 32,
    width: 32,
  },
});
export default LibraryStack;
