import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import useUIStore from '../logic/store';

function SettingsPage() {
  const {subs, sync} = useUIStore(state => ({
    subs: state.subs,
    sync: state.sync,
  }));
  console.log(subs, 'subs');
  return (
    <View>
      <Text>Your Feeds</Text>
    </View>
  );
}

export default SettingsPage;
