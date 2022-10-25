import firestore from '@react-native-firebase/firestore';

import React, {useState} from 'react';
import {StyleSheet, Text, Pressable, View, ScrollView} from 'react-native';

import Location from './Location';

const Mainapp = ({route}) => {
  const {courseId} = route.params;
  const {holeCt} = route.params;

  let holeCountArr = [];

  // add holes to holeCountArr
  for (let i = 1; i <= holeCt; i++) {
    holeCountArr.push(i);
  }

  // get the course using the courseId that was passed as a prop from Home page when course was selected.
  async function getCourse() {
    const courseDocument = await firestore()
      .collection('Courses')
      .doc(courseId)
      .get();
    return courseDocument;
  }

  // initialize state variables to store data from firestore database for selected course

  const [currentCourse, setCurrentCourse] = useState('');
  const [frontLatitude, setFrontLatitude] = useState();
  const [frontLongitude, setFrontLongitude] = useState();
  const [centerLatitude, setCenterLatitude] = useState();
  const [centerLongitude, setCenterLongitude] = useState();
  const [backLatitude, setBackLatitude] = useState();
  const [backLongitude, setBackLongitude] = useState();
  const [holeNumber, onChangeHole] = useState(1);

  // set the current hole coordinates
  const getCurrentHoleCoordinates = (data, holeNum) => {
    setFrontLatitude(data.Hole_GPS[holeNum].front.latitude);
    setFrontLongitude(data.Hole_GPS[holeNum].front.longitude);
    setCenterLatitude(data.Hole_GPS[holeNum].center.latitude);
    setCenterLongitude(data.Hole_GPS[holeNum].center.longitude);
    setBackLatitude(data.Hole_GPS[holeNum].back.latitude);
    setBackLongitude(data.Hole_GPS[holeNum].back.longitude);
  };

  // set the current course and current hole coordinates
  async function updateCourseData() {
    try {
      await getCourse().then(documentSnapshot => {
        setCurrentCourse(documentSnapshot.data().Course);
        getCurrentHoleCoordinates(documentSnapshot.data(), holeNumber);
      });
    } catch (err) {}
  }

  updateCourseData();

  return (
    <View style={{flex: 1, backgroundColor: '#100F11'}}>
      <View style={styles.main_container}>
        <View style={styles.circle}></View>
        <Text style={styles.header}>{currentCourse}</Text>
        {/* pass coordinates for current hole to location component for calculations */}
        <Location
          frontLat={frontLatitude}
          frontLon={frontLongitude}
          centerLat={centerLatitude}
          centerLon={centerLongitude}
          backLat={backLatitude}
          backLon={backLongitude}
        />
        <ScrollView horizontal={true} style={styles.scroll_container}>
          {/* map holes for scroll view using the holeCountArr  */}
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
        </ScrollView>
      </View>
    </View>
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
    fontSize: 30,
  },
  number_unselected: {
    color: 'black',
    fontFamily: 'Inter',
    fontSize: 30,
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
    top: 130,
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
