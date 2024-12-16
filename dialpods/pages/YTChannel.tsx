import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Button,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import {Podcast, YoutubeItem} from '../logic/types/types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {LibraryStackParamList} from './Home';
import {abbreviate, date_diff} from '../logic/utils';
import {useNavigation} from '@react-navigation/native';
type Props = NativeStackScreenProps<LibraryStackParamList, 'YTChannel'>;

function ChanPage(props: Props) {
  return (
    <View>
      <Text>{props.route.params.chan.channel.title}</Text>
      <FlatList
        data={props.route.params.chan.entries}
        keyExtractor={item => item.id}
        renderItem={item => <EpisodePreview ep={item.item} />}
      />
    </View>
  );
}

function EpisodePreview({ep}: {ep: YoutubeItem}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<LibraryStackParamList>>();
  function openEp() {
    navigation.navigate('YTPlayer', {ep});
  }
  return (
    <Pressable onPress={openEp}>
      <View style={styles.preview}>
        <Image source={{uri: ep.thumbnail}} style={styles.thumbnail} />
        <View>
          <Text>{abbreviate(ep.title, 50)}</Text>
          <Text>{abbreviate(ep.description, 200)}</Text>
        </View>
        <View>
          <Text>{date_diff(new Date(ep.published))}</Text>
          <Text>{ep.views.toLocaleString()} views</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default ChanPage;

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'black',
    padding: 2,
  },
  thumbnail: {width: 60, height: 60},
});
