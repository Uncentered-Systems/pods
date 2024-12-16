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

function Chips({
  chips,
  select,
  selected,
}: {
  chips: string[];
  select: (chip: string) => void;
  selected: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {chips.map(filter => (
        <TouchableOpacity
          key={filter}
          onPress={() => select(filter)}
          style={[styles.chip, selected === filter && styles.selectedChip]}>
          <Text
            style={[
              styles.chipText,
              selected === filter && styles.selectedChipText,
            ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default Chips;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FFE4D6', // Light orange border
  },
  selectedChip: {
    backgroundColor: '#FF9B50', // Orange background for selected state
    borderColor: '#FF9B50',
  },
  chipText: {
    color: '#FF9B50',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#FFF',
  },
});
