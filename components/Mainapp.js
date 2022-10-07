import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import {StyleSheet, Text, Pressable, View, ScrollView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Location from './Location';

const Mainapp = ({route, navigation}) => {
  const {courseId} = route.params;
  const {holeCt} = route.params;

  let holeCountArr = [];

  for (let i = 1; i <= holeCt; i++) {
    holeCountArr.push(i);
  }

  async function getCourse() {
    const courseDocument = await firestore()
      .collection('Courses')
      .doc(courseId)
      .get();
    return courseDocument;
  }

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

  const [holeNumber, onChangeHole] = useState(1);

  return (
    <View style={{flex: 1, backgroundColor: '#100F11'}}>
      <View style={styles.main_container}>
        <View style={styles.circle}></View>
        <Text style={styles.header}>{currentCourse}</Text>
        <Location
          frontLat={frontLatitude}
          frontLon={frontLongitude}
          centerLat={centerLatitude}
          centerLon={centerLongitude}
          backLat={backLatitude}
          backLon={backLongitude}
        />
        <ScrollView horizontal={true} style={styles.scroll_container}>
          {holeCountArr.map(hole => {
            return (
              <Pressable
                style={
                  hole === holeNumber ? styles.selected : styles.unselected
                }
                key={hole}
                onPress={() => onChangeHole(hole)}>
                <Text
                  style={
                    hole === holeNumber
                      ? styles.number_selected
                      : styles.number_unselected
                  }>
                  {hole}
                </Text>
              </Pressable>
            );
          })}
          {/* <View style={styles.holes}>
            <Text style={styles.number}>1</Text>
          </View> */}
          {/* <View style={styles.holes}></View>
          <View style={styles.holes}></View>
          <View style={styles.holes}></View>
          <View style={styles.holes}></View>
          <View style={styles.holes}></View>
          <View style={styles.holes}></View>
          <View style={styles.holes}></View>
          <View style={styles.holes}></View>
          <View style={styles.holes}></View> */}
        </ScrollView>
      </View>
    </View>

    // <View style={styles.main_container}>
    //   <TextInput
    //     style={styles.input}
    //     onChangeText={onChangeHole}
    //     value={holeNumber}
    //     placeholder="input hole number"
    //     keyboardType="numeric"
    //   />
    //   <View style={styles.container}>
    //     <Text>
    //       Course Name: {currentCourse}
    //       {'\n'}
    //       Hole Number: {holeNumber}
    //       {'\n'}
    //       Longitude: {frontLatitude}
    //       {'\n'}
    //       Latitude: {frontLongitude}
    //       {'\n'}
    //     </Text>
    //   </View>
    //   <View>

    //   </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#100F11',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    marginHorizontal: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 65 / 2,
    borderWidth: 1.5,
    color: '#CCCCCC',
    backgroundColor: '#00655F',
    borderColor: '#CCCCCC',
  },
  unselected: {
    marginHorizontal: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 65 / 2,
    borderWidth: 1.5,
    color: 'black',
    backgroundColor: '#CCCCCC',
    borderColor: 'black',
  },
  number_selected: {
    color: '#CCCCCC',
    fontFamily: 'Inter',
    fontSize: 34,
  },
  number_unselected: {
    color: 'black',
    fontFamily: 'Inter',
    fontSize: 34,
  },
  scroll_container: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    height: 65,
    bottom: 60,
  },
  select_hole: {
    position: 'absolute',
    width: 185,
    height: 35,
    bottom: 135,
    fontFamily: 'Jaldi-Regular',
    fontSize: 20,
    letterSpacing: 0.08,
    textAlign: 'center',
  },

  header: {
    textAlign: 'center',
    position: 'absolute',
    top: 30,
    fontSize: 45,
    letterSpacing: 1,
    fontFamily: 'Jaldi-Regular',
    lineHeight: 55,
  },
  circle: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 450 / 2,
    backgroundColor: '#252525',
    top: 100,
  },
  background_square: {
    position: 'absolute',
    width: 500,
    height: 300,
    backgroundColor: '#252525',
    top: 0,
  },
});

export default Mainapp;
