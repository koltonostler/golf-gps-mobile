import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Location from './Location';

async function getCourse() {
  const courseDocument = await firestore()
    .collection('Courses')
    .doc('a0KdZWopIoyCVb7O9NYd')
    .get();
  return courseDocument;
}

const Mainapp = () => {
  const [currentCourse, setCurrentCourse] = useState('');
  const [frontLatitude, setFrontLatitude] = useState();
  const [frontLongitude, setFrontLongitude] = useState();
  const [centerLatitude, setCenterLatitude] = useState();
  const [centerLongitude, setCenterLongitude] = useState();
  const [backLatitude, setBackLatitude] = useState();
  const [backLongitude, setBackLongitude] = useState();

  const getCurrentHoleCoordinates = (data, holeNum) => {
    setFrontLatitude(data.Hole_GPS[holeNum].front.latitude);
    setFrontLongitude(data.Hole_GPS[holeNum].front.longitude);
    setCenterLatitude(data.Hole_GPS[holeNum].center.latitude);
    setCenterLongitude(data.Hole_GPS[holeNum].center.longitude);
    setBackLatitude(data.Hole_GPS[holeNum].back.latitude);
    setBackLongitude(data.Hole_GPS[holeNum].back.longitude);
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

  const [holeNumber, onChangeHole] = useState(null);

  return (
    <View>
      <TextInput
        onChangeText={onChangeHole}
        value={holeNumber}
        placeholder="input hole number"
        keyboardType="numeric"
      />
      <View style={styles.container}>
        <Text>
          Course Name: {currentCourse}
          {'\n'}
          Hole Number: {holeNumber}
          {'\n'}
          Longitude: {frontLatitude}
          {'\n'}
          Latitude: {frontLongitude}
          {'\n'}
        </Text>
      </View>
      <View>
        <Location
          frontLat={frontLatitude}
          frontLon={frontLongitude}
          centerLat={centerLatitude}
          centerLon={centerLongitude}
          backLat={backLatitude}
          backLon={backLongitude}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Mainapp;
