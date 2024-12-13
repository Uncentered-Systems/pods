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
import {Podcast} from '../logic/types/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LibraryStackParamList} from './Home';
type Props = NativeStackScreenProps<LibraryStackParamList, 'Feed'>;

function FeedPage(props: Props) {
  return (
    <View>
      <Text>{props.route.params.feed.name}</Text>
    </View>
  );
}

export default FeedPage;
