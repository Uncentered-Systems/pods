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
import {WebView} from 'react-native-webview';
import * as Keychain from 'react-native-keychain';
import useUIStore from '../logic/store';

function SettingsPage() {
  const {cookie, setCookie} = useUIStore(state => ({
    cookie: state.cookie,
    setCookie: state.setCookie,
  }));
  async function logout() {
    await Keychain.resetGenericPassword();
    setCookie('');
  }
  return (
    <View>
      <WebView
        source={{uri: 'https://reactnative.dev/'}}
        style={{flex: 1}}
        onRenderProcessGone={w => console.log('webview crash', w)}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

export default SettingsPage;
