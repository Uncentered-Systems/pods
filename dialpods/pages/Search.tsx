import React, {useEffect, useState} from 'react';
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
// import { corsProxy, saveFeed } from '../logic/api';
import {
  parseHTMLRes,
  parseRSSFeed,
  parseXMLRes,
  parseYoutubeChannel,
} from '../logic/utils';
import useUIStore from '../logic/store';
import type {SearchResult} from '../logic/types/types';
import {Button} from 'react-native';

function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('https://www.youtube.com/@bookclubradio');
  const [results, setResults] = useState<SearchResult[]>([]);

  console.log('search page loaded');
  function handleButton() {
    // handleURL(url);
    console.log('button pressed', input);
    const url = new URL(input);
    console.log('got url', url);
    handleYouTube(input);
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

  async function handleURL(url: URL) {
    console.log('handling url');
    // if (url.hostname.endsWith('youtube.com')) handleYouTube(url);
    // else handleRSS(url);
  }

  async function handleYouTube(url: string) {
    console.log('handling youtube', url);
    // if (!url.search) {
    // const res = await corsProxy(url);
    console.log('fetching', url);
    const res = await fetch(url);
    console.log('youtube response', res);
    const txt = await res.text();
    console.log('youtube text', txt);
    const doc = await parseHTMLRes(txt);
    console.log('doc', doc);
    console.log('head', doc.head);
    const mparsed = parseYoutubeChannel(doc.head);
    console.log(mparsed, 'mparsed');
    // if ('error' in mparsed) handleError(url.toString(), mparsed.error);
    // else setResults(r => [...r, mparsed.ok]);
    // }
  }

  async function handleRSS(url: URL) {
    // const res = await corsProxy(url);
    // const res = await fetch(url);
    // if (!('ok' in res)) return handleError(url.toString(), 'error fetching');
    // const s = res.ok;
    // if (!('HTML' in s)) return handleError('', '');
    // const doc = await parseXMLRes(s.HTML);
    // try {
    //   const mparsed = parseRSSFeed(url.toString(), doc);
    //   if ('error' in mparsed) handleError(url.toString(), mparsed.error);
    //   else setResults(r => [...r, mparsed.ok]);
    // } catch (e) {
    //   console.log('wtf happened', e);
    // }
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
    // resync();
    setResults([]);
    setInput('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Search</Text>
      </View>

      <ScrollView style={styles.resultContainer}>
        {results.map((result, index) => (
          <SearchResultItem key={index} {...result} close={close} />
        ))}
      </ScrollView>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search pod"
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#666"
        />
        {loading && <ActivityIndicator color="#f97316" />}
      </View>
      <Button title="hi" onPress={handleButton} />
    </View>
  );
}

function SearchResultItem({
  image,
  name,
  url,
  close,
}: SearchResult & {close: () => void}) {
  async function save() {
    // const r2 = await saveFeed({image, name, url});
    // if ('ok' in r2) close();
  }

  return (
    <View style={styles.resultItem}>
      <Image source={{uri: image}} style={styles.resultImage} />
      <Text style={styles.resultName}>{name}</Text>
      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
});

export default SearchScreen;
