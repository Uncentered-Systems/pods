/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as Keychain from 'react-native-keychain';

// import McIcon from '@react-native-vector-icons/material-design-icons';
// import Fa6 from '@react-native-vector-icons/fontawesome6';

import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  AppState,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';

// pages
import LoginPage from './pages/Login.tsx';
import HomePage from './pages/Home.tsx';
import LibraryPage from './pages/Library.tsx';
import ImportPage from './pages/Import.tsx';
// import SearchPage from './pages/Search.tsx';
import SettingsPage from './pages/Settings.tsx';
import useUIStore from './logic/store.ts';
import {globalStyles} from './styles.ts';
// <pages

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(true);
  const {sync, cookie, setCookie, setURL} = useUIStore(state => ({
    sync: state.sync,
    cookie: state.cookie,
    setCookie: state.setCookie,
    setURL: state.setURL,
  }));

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    init();
  }, []);

  async function init() {
    const creds = await Keychain.getGenericPassword();
    console.log('keychain creds', creds);
    if (creds) {
      setCookie(creds.password);
      setURL(creds.username);
      await sync();
    }
    setLoading(false);
  }
  if (loading) return <ActivityIndicator />;
  else if (!cookie) return <LoginPage />;
  else
    return (
      <NavigationContainer>
        <TabNav />
      </NavigationContainer>
    );
}
// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

function TabNav() {
  const Footer = createBottomTabNavigator();
  return (
    <Footer.Navigator
      screenOptions={{headerShown: false, sceneStyle: globalStyles.main}}>
      <Footer.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            if (focused) return <McIcon name="home" size={30} />;
            else return <McIcon name="home-outline" size={30} />;
          },
        }}
      />
      <Footer.Screen
        name="Search"
        component={ImportPage}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            if (focused) return <McIcon name="search-web" size={30} />;
            else return <McIcon name="search-web" size={30} />;
          },
        }}
      />
      <Footer.Screen
        name="Library"
        component={LibraryPage}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            if (focused) return <McIcon name="rss-box" size={30} />;
            else return <McIcon name="rss" size={30} />;
          },
        }}
      />
      <Footer.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarIcon: ({focused, color, size}) => {
            if (focused) return <McIcon name="cog" size={30} />;
            else return <McIcon name="cog-outline" size={30} />;
          },
        }}
      />
    </Footer.Navigator>
  );
}
