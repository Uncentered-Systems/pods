import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Fa6 from 'react-native-vector-icons/FontAwesome6';
import Octicon from 'react-native-vector-icons/Octicons';
import React, {useCallback, useEffect, useRef, useState} from 'react';

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
import Slider from '@react-native-community/slider';
import {LibraryStackParamList} from './Home';
import YoutubePlayer, {
  PLAYER_STATES,
  YoutubeIframeRef,
} from 'react-native-youtube-iframe';

import Video, {OnLoadData, Orientation, VideoRef} from 'react-native-video';
import {globalStyles} from '../styles';
import {parseSeconds, printLongTime} from '../logic/utils';
import Clipper from '../components/Clipper';
import {sendCurate} from '../logic/api';
import Chips from '../components/Chip';
import useUIStore from '../logic/store';

type YTProps = NativeStackScreenProps<LibraryStackParamList, 'YTPlayer'>;
type RSSProps = NativeStackScreenProps<LibraryStackParamList, 'RSSPlayer'>;
export function YTPlayerPage(props: YTProps) {
  const ep = props.route.params.ep;
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [curated, setCurated] = useState(false);
  const [curationOpen, setOpenCuration] = useState(false);

  function handleSeek(secs: number) {
    if (!playerRef.current) return;
    playerRef.current.seekTo(secs, false);
  }

  const playerRef = useRef<YoutubeIframeRef>(null);
  function rewind() {
    if (!playerRef.current) return;
    playerRef.current.seekTo(currentTime - 10, false);
  }
  function fforward() {
    if (!playerRef.current) return;
    playerRef.current.seekTo(currentTime + 10, false);
  }
  async function bookmarkEp() {
    console.log('bookmarking TODO');
  }

  function onStateChange(state: PLAYER_STATES) {
    if (state === PLAYER_STATES.ENDED) setPlaying(false);
    else if (state === PLAYER_STATES.PAUSED) setPlaying(false);
    else if (state === PLAYER_STATES.PLAYING) setPlaying(false);
    else if (state === PLAYER_STATES.UNSTARTED) setPlaying(false);
    else if (state === PLAYER_STATES.BUFFERING) setPlaying(false);
    else if (state === PLAYER_STATES.VIDEO_CUED) setPlaying(false);
  }

  return (
    <View>
      <YoutubePlayer
        height={300}
        play={playing}
        videoId={ep.id}
        onChangeState={onStateChange}
        ref={playerRef}
        initialPlayerParams={{}}
      />
      <View style={globalStyles.spreadRow}>
        <Text>Channel name</Text>
        <Fa6 onPress={bookmarkEp} name="bookmark" size={32} />
      </View>
      <Text>{ep.title}</Text>
      <Text>{ep.description}</Text>
      <PlayerControls
        currentTime={currentTime}
        duration={duration}
        handleSeek={handleSeek}
        playing={playing}
        setPlaying={setPlaying}
        rewind={rewind}
        fforward={fforward}
        setOpenCuration={setOpenCuration}
      />
    </View>
  );
}
export function RSSPlayerPage(props: RSSProps) {
  const playerRef = useRef<VideoRef>(null);
  const ep = props.route.params.ep;
  // console.log({ep});
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [curated, setCurated] = useState(false);
  const [curationOpen, setOpenCuration] = useState(false);
  // console.log({duration, currentTime});

  async function curate(
    streamName: string,
    start_time: number,
    end_time: number,
  ) {
    const content = {
      resource: ep.enclosure.url,
      start_time,
      end_time,
    };
    const post = {
      type: 'media',
      content,
    };
    const combinedUuid = `media-${Date.now()}`;
    const res = await sendCurate(
      streamName,
      'media',
      ep.enclosure.url,
      post,
      combinedUuid,
      null,
    );
  }

  useEffect(() => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.resume();
    else playerRef.current.pause();
  }, [playing]);

  function handleProgress(e: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  }) {
    // console.log(e, 'podcast progress');
    setCurrentTime(e.currentTime);
  }
  function handleReady(e: OnLoadData) {
    console.log('media ready', e);
    setDuration(e.duration);
  }
  function handleSeek(s: number) {
    if (!playerRef.current) return;
    playerRef.current.seek(s);
  }
  function rewind() {
    if (!playerRef.current) return;
    playerRef.current.seek(currentTime - 10);
  }
  function fforward() {
    if (!playerRef.current) return;
    playerRef.current.seek(currentTime + 10);
  }
  async function bookmarkEp() {
    console.log('bookmarking TODO');
  }
  return (
    <View style={{padding: 10}}>
      <Text>Now Playing</Text>
      <Video
        source={{uri: ep.enclosure.url}}
        ref={playerRef}
        onProgress={handleProgress}
        onLoad={handleReady}
      />
      <View style={globalStyles.spreadRow}>
        <Text>Channel name</Text>
        <Fa6 onPress={bookmarkEp} name="bookmark" size={32} />
      </View>
      <Text>{ep.title}</Text>
      <Text>{ep.description}</Text>
      {curationOpen ? (
        <ClipperControls
          currentTime={currentTime}
          duration={duration}
          setOpenCuration={setOpenCuration}
          curate={curate}
        />
      ) : (
        <PlayerControls
          currentTime={currentTime}
          duration={duration}
          handleSeek={handleSeek}
          playing={playing}
          setPlaying={setPlaying}
          rewind={rewind}
          fforward={fforward}
          setOpenCuration={setOpenCuration}
        />
      )}
    </View>
  );
}

function PlayerControls({
  currentTime,
  duration,
  handleSeek,
  playing,
  setPlaying,
  rewind,
  fforward,
  setOpenCuration,
}: {
  currentTime: number;
  duration: number;
  handleSeek: (s: number) => void;
  playing: boolean;
  setPlaying: (b: boolean) => void;
  rewind: () => void;
  fforward: () => void;
  setOpenCuration: (b: boolean) => void;
}) {
  function onss(v: number) {
    console.log('sliding!', v);
  }
  function onsc(v: number) {
    console.log('slided!', v);
  }
  return (
    <>
      <View style={{marginTop: 30}}>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={handleSeek}
          onSlidingStart={onss}
          onSlidingComplete={onsc}
          disabled={false}
        />
        <View style={globalStyles.spreadRow}>
          <Text>{printLongTime(parseSeconds(currentTime))}</Text>
          <Text>{printLongTime(parseSeconds(duration))}</Text>
        </View>
      </View>
      <View style={globalStyles.spreadRow}>
        <Text style={{fontSize: 32}}>1x</Text>

        <View style={{...globalStyles.spreadRow, gap: 16}}>
          <Fa6 name="arrow-rotate-left" size={32} onPress={rewind} />
          {playing ? (
            <Fa6
              name="circle-pause"
              size={48}
              onPress={() => setPlaying(false)}
            />
          ) : (
            <Fa6
              name="circle-play"
              size={48}
              onPress={() => setPlaying(true)}
            />
          )}
          <Fa6 name="arrow-rotate-right" size={32} onPress={fforward} />
        </View>
        <Fa6 name="scissors" size={32} onPress={() => setOpenCuration(true)} />
      </View>
    </>
  );
}

function ClipperControls({
  currentTime,
  duration,
  setOpenCuration,
  curate,
}: {
  currentTime: number;
  duration: number;
  setOpenCuration: (b: boolean) => void;
  curate: (streamName: string, start: number, end: number) => Promise<void>;
}) {
  const {streams} = useUIStore(state => ({
    streams: state.streams,
  }));

  const [error, setError] = useState('');
  const [start, setStart] = useState(currentTime);
  const [end, setEnd] = useState(duration);
  const [selectedStream, setSelectedStream] = useState('');
  const [streamInput, setInput] = useState('');

  async function doCurate() {
    if (!selectedStream && !streamInput) setError('choose a stream');
    else {
      const streamName = selectedStream || streamInput;
      console.log('curating to', streamName);
      const res = await curate(streamName, start, end);
      console.log('curated res', res);
    }
  }
  function handleChange(low: number, high: number, _byUser: boolean) {
    setStart(low);
    setEnd(high);
  }

  function inputStream(s: string) {
    setSelectedStream('');
    setInput(s);
  }

  return (
    <>
      <View style={{marginTop: 30}}>
        <Clipper
          handleChange={handleChange}
          duration={duration}
          low={start}
          high={end}
        />
        <View style={globalStyles.spreadRow}>
          <Text>{printLongTime(parseSeconds(start))}</Text>
          <Text>{printLongTime(parseSeconds(end))}</Text>
        </View>
      </View>
      <View style={globalStyles.spreadRow}>
        <Text style={{fontSize: 32}}>1x</Text>

        <View style={{...globalStyles.spreadRow, gap: 16}}>
          <Fa6
            name="angle-left"
            size={32}
            onPress={() => setStart(s => (s - 10 < 0 ? 0 : s - 10))}
          />
          <Fa6
            name="angle-right"
            size={32}
            onPress={() =>
              setStart(s => (s + 10 > duration ? duration : s + 10))
            }
          />
          <Octicon name="share" size={48} onPress={doCurate} />
          <Fa6
            name="angle-left"
            size={32}
            onPress={() => setEnd(s => (s - 10 < 0 ? 0 : s - 10))}
          />
          <Fa6
            name="angle-right"
            size={32}
            onPress={() => setEnd(s => (s + 10 > duration ? duration : s + 10))}
          />
        </View>
        <Fa6 name="scissors" size={32} onPress={() => setOpenCuration(false)} />
      </View>
      {error && <Text style={globalStyles.error}>{error}</Text>}
      <View>
        <Text>Choose a Stream</Text>
        <Chips
          chips={streams}
          selected={selectedStream}
          select={setSelectedStream}
        />
        <TextInput
          placeholder="new stream"
          value={streamInput}
          onChangeText={inputStream}
        />
      </View>
    </>
  );
}
