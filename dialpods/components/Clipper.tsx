import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Button,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import RangeSlider from 'rn-range-slider';

function Clipper({
  handleChange,
  duration,
  disableRange = false,
  low,
  high,
}: {
  handleChange: (low: number, high: number, byUser: boolean) => void;
  duration: number;
  disableRange?: boolean;
  low?: number;
  high?: number;
}) {
  return (
    <RangeSlider
      disableRange={disableRange}
      min={0}
      max={duration}
      step={1}
      renderThumb={() => <Thumb name="" />}
      renderRail={Rail}
      renderRailSelected={RailSelected}
      onValueChanged={handleChange}
      low={low}
      high={high}
    />
  );
}

export default Clipper;

const THUMB_RADIUS_LOW = 12;
const THUMB_RADIUS_HIGH = 16;

const Thumb = ({name}) => {
  const styles = StyleSheet.create({
    rootLow: {
      width: THUMB_RADIUS_LOW * 2,
      height: THUMB_RADIUS_LOW * 2,
      borderRadius: THUMB_RADIUS_LOW,
      borderWidth: 2,
      borderColor: '#7f7f7f',
      backgroundColor: '#aaaaaa',
    },
    rootHigh: {
      width: THUMB_RADIUS_HIGH * 2,
      height: THUMB_RADIUS_HIGH * 2,
      borderRadius: THUMB_RADIUS_HIGH,
      borderWidth: 2,
      borderColor: '#7f7f7f',
      backgroundColor: '#ffffff',
    },
  });

  return <View style={name === 'high' ? styles.rootHigh : styles.rootLow} />;
};

const Rail = () => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#7f7f7f',
    },
  });
  return <View style={styles.root} />;
};

const RailSelected = () => {
  const styles = StyleSheet.create({
    root: {
      height: 4,
      backgroundColor: '#4499ff',
      borderRadius: 2,
    },
  });
  return <View style={styles.root} />;
};
