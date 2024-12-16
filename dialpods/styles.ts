import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  main: {
    // backgroundColor: '#FFF9F2',
    backgroundColor: 'red',
  },
  accent: {color: '#F8A31F'},
  input: {borderRadius: 32, paddingHorizontal: 24, paddingVertical: 8},
  li: {padding: 12, borderRadius: 12, backgroundColor: '#FFFFFF', gap: 8},
  error: {color: 'red'},
  spreadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
