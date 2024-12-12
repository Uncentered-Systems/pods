import React, { useEffect, useState } from 'react';
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
import * as Keychain from 'react-native-keychain';
import useUIStore from '../logic/store';

function SettingsPage() {
  const { cookie, setCookie } = useUIStore(state => ({
    cookie: state.cookie,
    setCookie: state.setCookie,
  }));
  async function logout() {
    await Keychain.resetGenericPassword();
    setCookie("")
  }
  return (<View>
    <Button title="Logout" onPress={logout} />
  </View>)
}

export default SettingsPage
