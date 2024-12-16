import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Fa6 from 'react-native-vector-icons/FontAwesome6';
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
        <Fa6 onPress={bookmarkEp} name="bookmark" size={48} />
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
  console.log({ep});
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [curated, setCurated] = useState(false);
  const [curationOpen, setOpenCuration] = useState(false);
  // console.log({duration, currentTime});
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
    setCurrentTime(currentTime);
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
    <View>
      <Video
        source={{uri: ep.enclosure.url}}
        ref={playerRef}
        onProgress={handleProgress}
        onLoad={handleReady}
      />
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
  return (
    <>
      <View>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          value={currentTime}
          onValueChange={handleSeek}
        />
        <View style={globalStyles.spreadRow}>
          <Text>{printLongTime(parseSeconds(currentTime))}</Text>
          <Text>{printLongTime(parseSeconds(duration))}</Text>
        </View>
      </View>
      <View style={globalStyles.spreadRow}>
        <Text style={{fontSize: 48}}>1x</Text>

        <View style={globalStyles.spreadRow}>
          <Fa6 name="arrow-rotate-left" size={48} onPress={rewind} />
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
          <Fa6 name="arrow-rotate-right" size={48} onPress={fforward} />
        </View>
        <Fa6 name="scissors" size={48} onPress={() => setOpenCuration(true)} />
      </View>
    </>
  );
}
