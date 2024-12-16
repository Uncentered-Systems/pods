import React, {useEffect, useState} from 'react';
import Fa5 from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  parseHTMLRes,
  parseRSSFeed,
  parseXMLRes,
  parseYoutubeChannel,
} from '../logic/utils';
import useUIStore from '../logic/store';
import type {SearchResult} from '../logic/types/types';
import {Button} from 'react-native';
import {saveFeed} from '../logic/api';
import {globalStyles} from '../styles';

function ImportScreen() {
  const {sync} = useUIStore(state => ({
    sync: state.sync,
  }));
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('https://www.youtube.com/@bookclubradio');
  // const [input, setInput] = useState('https://feeds.transistor.fm/acquired');
  const [result, setResult] = useState<SearchResult>();

  console.log('search page loaded');
  function handleButton() {
    handleURL(input);
  }
  // useEffect(() => {
  //   console.log('hi!!', input);
  //   if (!input) setResults([]);
  //   if (input.length > 2)
  //     try {
  //     } catch (_) {
  //       handleSearch(input);
  //     }
  // }, [input]);

  async function handleURL(url: string) {
    console.log('handling url');
    if (url.includes('youtube.com')) handleYouTube(url);
    else handleRSS(url);
  }

  async function handleYouTube(url: string) {
    console.log('handling youtube', url);
    // if (!url.search) {
    console.log('fetching', url);
    const res = await fetch(url);
    const txt = await res.text();
    const doc = await parseHTMLRes(txt);
    const head = doc.documentElement.querySelector('head');
    if (!head) return handleError('', 'no head');
    const mparsed = parseYoutubeChannel(head);
    console.log(mparsed, 'mparsed');
    if ('error' in mparsed) handleError(url.toString(), mparsed.error);
    else setResult(mparsed.ok);
    // }
  }

  async function handleRSS(url: string) {
    const res = await fetch(url);
    const xml = await res.text();
    console.log('rss res', xml);
    const doc = await parseXMLRes(xml);
    console.log('parsed xml', doc);
    try {
      const mparsed = parseRSSFeed(url.toString(), doc);
      console.log('mparsed', mparsed);
      if ('error' in mparsed) handleError(url.toString(), mparsed.error);
      else setResult(mparsed.ok);
    } catch (e) {
      console.log('wtf happened', e);
    }
  }

  async function handleSearch(input: string) {
    setLoading(true);
    console.log('searching', input);
  }

  function handleError(source: string, error: string) {
    const alert = {message: `${error}: ${source}`, timeout: 2000};
    // setAlert(alert);
  }

  function close() {
    sync();
    setResult(undefined);
    setInput('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Search</Text>
      </View>

      {loading && <ActivityIndicator color="#f97316" />}
      <ScrollView style={styles.resultContainer}>
        {result && <SearchResult {...result} close={close} />}
      </ScrollView>

      <View style={{...globalStyles.input, ...globalStyles.spreadRow}}>
        <TextInput
          style={styles.input}
          placeholder="Search pod"
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#666"
        />
        <Fa5
          name="search"
          size={32}
          color={globalStyles.accent.color}
          onPress={handleButton}
        />
      </View>
    </View>
  );
}

function SearchResult({
  image,
  name,
  description,
  url,
  close,
}: SearchResult & {close: () => void}) {
  async function openChan() {
    // navigation.navigate("chan", {image, name, url})
  }
  async function save() {
    console.log('saving feed', {image, name, url});
    const res = await saveFeed({image, name, url});
    console.log('save res', res);
    if ('ok' in res) close();
  }

  return (
    <View style={styles.resultItem}>
      <Image source={{uri: image}} style={styles.resultImage} />
      <Text style={styles.resultName}>{name}</Text>
      <Text style={styles.resultDesc}>{description}</Text>
      <View style={{flexDirection: 'row', gap: 36}}>
        <TouchableOpacity style={styles.openButton} onPress={openChan}>
          <Text style={styles.openButtonText}>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#d4d4d4',
    marginBottom: 1,
    gap: 12,
  },
  resultImage: {
    width: 92,
    height: 92,
  },
  resultName: {
    fontWeight: 700,
    fontSize: 24,
  },
  resultDesc: {},
  openButton: {
    backgroundColor: '#FFF9F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  openButtonText: {
    color: '#f97316',
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
});

export default ImportScreen;
