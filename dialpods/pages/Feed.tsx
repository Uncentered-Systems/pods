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
type Props = NativeStackScreenProps<LibraryStackParamList, 'Feed'>;

function FeedPage(props: Props) {
  return (
    <View>
      <Text>{props.route.params.feed.podcast.title}</Text>
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
        <Text>{ep.title}</Text>
        <Text>{ep.description}</Text>
        <Text>{new Date(ep.pubDate).toLocaleDateString()}</Text>
      </View>
    </Pressable>
  );
}

export default FeedPage;
const styles = StyleSheet.create({
  preview: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'black',
    padding: 2,
  },
  thumbnail: {width: 60, height: 60},
});
