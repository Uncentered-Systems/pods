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
import type {Podcast} from '../logic/types/types';
import useUIStore from '../logic/store';
import {createStaticNavigation, useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import FeedPage from './Feed.tsx';
import PlayerPage from './Player.tsx';

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export type LibraryStackParamList = {
  Library: undefined;
  Feed: {feed: Podcast};
  Player: undefined;
};
function LibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Library" component={LibraryPage} />
      <Stack.Screen
        name="Feed"
        component={FeedPage}
        initialParams={{feed: {name: '', url: '', image: ''}}}
      />
      <Stack.Screen name="Player" component={PlayerPage} />
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
  const {subs, sync} = useUIStore(state => ({
    subs: state.subs,
    sync: state.sync,
  }));
  console.log(subs, 'subs @ home');

  return (
    <View>
      <Text>Your Feeds</Text>
      <FlatList
        data={Object.values(subs)}
        keyExtractor={item => item.url}
        renderItem={item => <FeedPreview feed={item.item} />}></FlatList>
    </View>
  );
}

function FeedPreview({feed}: {feed: Podcast}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<LibraryStackParamList>>();
  function openFeedPage() {
    navigation.navigate('Feed', {feed});
  }
  return (
    <Pressable onPress={openFeedPage}>
      <View style={{height: 100, borderColor: 'green'}}>
        <Image source={{uri: feed.image}} />
        <Text>{feed.name}</Text>
      </View>
    </Pressable>
  );
}

export default LibraryStack;
