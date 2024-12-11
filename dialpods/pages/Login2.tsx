import React, {useState} from 'react';
import * as Keychain from 'react-native-keychain';
import {AsyncRes} from '../logic/types/types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {sha256} from 'react-native-sha256';
import {ActivityIndicator} from 'react-native';
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
function LoginScreen() {
  const [nodeURL, setURL] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function saveCoki(coki: string) {
    try {
      await Keychain.setGenericPassword('kinode-cookie', coki);
      // goto
    } catch (e) {
      setError('error saving kinode credentials');
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    const res = await kinodeLogin(nodeURL, password);
    setLoading(false);
    console.log('kinode cookie', res);
    if ('ok' in res) saveCoki(res.ok);
    else
      setError(
        'error logging in to your kinode. Check your credentials and try again',
      );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.logoContainer}>
          <Image
            // source={require('./path-to-your-logo.png')} // Replace with your logo path
            src="https://cdn.prod.website-files.com/672cc4c2f95a65f9585e8f5d/672cc4c2f95a65f9585e8f78_logo.svg"
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Kinode URL"
            value={nodeURL}
            onChangeText={setURL}
            keyboardType="url"
            autoCapitalize="none"
            autoComplete="url"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          {loading && <ActivityIndicator color="#f97316" />}
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 100,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: 'black',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
