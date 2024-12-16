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
import {Podcast, RSSFeedItem} from '../logic/types/types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {LibraryStackParamList} from './Home';
import {useNavigation} from '@react-navigation/core';
import {abbreviate} from '../logic/utils';
type Props = NativeStackScreenProps<LibraryStackParamList, 'Feed'>;

function FeedPage(props: Props) {
  const podcast = props.route.params.feed.podcast;
  console.log('podcast', podcast);
  return (
    <View style={{padding: 10}}>
      <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
        <Image source={{uri: podcast.image}} style={styles.podcastLogo} />
        <View>
          <Text style={{fontWeight: 700, fontSize: 28}}>{podcast.title}</Text>
          <Text>{podcast.description}</Text>
        </View>
      </View>
      <FlatList
        data={props.route.params.feed.episodes}
        keyExtractor={item => item.guid.value}
        renderItem={item => <EpisodePreview ep={item.item} />}
      />
    </View>
  );
}

function EpisodePreview({ep}: {ep: RSSFeedItem}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<LibraryStackParamList>>();
  function openEp() {
    navigation.navigate('RSSPlayer', {ep});
  }
  return (
    <Pressable onPress={openEp}>
      <View style={styles.preview}>
        <Text style={styles.title}>{ep.title}</Text>
        <Text>{abbreviate(ep.description, 100)}</Text>
        <Text style={styles.date}>
          {new Date(ep.pubDate).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}

export default FeedPage;
const styles = StyleSheet.create({
  podcastLogo: {width: 92, height: 92},
  preview: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 2,
  },
  title: {
    fontWeight: 700,
  },
  date: {marginTop: 10},
  thumbnail: {width: 60, height: 60},
});
