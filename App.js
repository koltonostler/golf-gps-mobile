/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
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
};

async function getCourse() {
  const courseDocument = await firestore()
    .collection('Courses')
    .doc('a0KdZWopIoyCVb7O9NYd')
    .get();
  return courseDocument;
}

// async function getHoleGPS() {
//   await firestore().collection('Courses').doc('a0KdZWopIoyCVb7O9NYd').collection().get()
// }

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [currentCourse, setCurrentCourse] = useState('');
  const [currentHoleLatitude, setCurrentHoleLatitude] = useState();
  const [currentHoleLongitude, setCurrentHoleLongitude] = useState();

  const getCurrentHoleCoordinates = (data, holeNum) => {
    setCurrentHoleLatitude(data.Hole_GPS[holeNum].coordinate.latitude);
    setCurrentHoleLongitude(data.Hole_GPS[holeNum].coordinate.longitude);
  };

  async function updateGPSData() {
    try {
      await getCourse().then(documentSnapshot => {
        setCurrentCourse(documentSnapshot.data().Course);
        getCurrentHoleCoordinates(documentSnapshot.data(), holeNumber);
      });
    } catch (err) {}
  }

  updateGPSData();

  const [holeNumber, onChangeNumber] = useState(null);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={styles.container}>
            <Text style={styles.h1}>Golf GPS App</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={holeNumber}
            placeholder="input hole number"
            keyboardType="numeric"
          />
          <View style={styles.container}>
            <Section style={styles.sectionDescription} title="GPS Coordinates">
              <Text>
                Course Name: {currentCourse}
                {'\n'}
                Hole Number: {holeNumber}
                {'\n'}
                Longitude: {currentHoleLatitude}
                {'\n'}
                Latitude: {currentHoleLongitude}
                {'\n'}
              </Text>
            </Section>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    fontSize: 50,
    fontWeight: '700',
    color: 'blue',
    margin: 25,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    alignSelf: 'center',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
