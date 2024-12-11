import {sha256} from 'react-native-sha256';
import React, {useEffect, useState} from 'react';
import {AsyncRes} from '../logic/types/types';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Button,
} from 'react-native';
async function doHash(s: string) {
  return sha256(s);
}
export async function kinodeLogin(url: string, pw: string): AsyncRes<string> {
  const hash = await doHash(pw);
  const opts = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({password_hash: `0x${hash}`, subdomain: ''}),
  };
  const res = await fetch(url + '/login', opts);
  console.log(res, 'res');
  const cookie = res.headers.get('set-cookie');
  // res.text() returns the keyfile
  if (!cookie) return {error: 'Kinode login failed'};
  return {ok: cookie};
}

function LoginPage() {
  const [nodeURL, setURL] = useState('https://kino.yago.one');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    setLoading(true);
    setError('');
    const res = await kinodeLogin(nodeURL, password);
    setLoading(false);
    console.log('kinode cookie', res);
    if ('ok' in res) setError('ok!');
    else setError('error!');
  }
  return (
    <View>
      <Text>Login to your Kinode</Text>
      <TextInput
        style={styles.input}
        placeholder="URL"
        value={nodeURL}
        onChangeText={setURL}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
        placeholderTextColor="#666"
      />
      <Button title="Submit" onPress={submit} />
      {loading && <ActivityIndicator color="#f97316" />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navbar: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  navbarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'black',
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 8,
    padding: 8,
    color: 'black',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#d4d4d4',
    marginBottom: 1,
  },
  resultImage: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  resultName: {
    flex: 1,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    color: 'white',
  },
  error: {
    color: 'red',
  },
});
