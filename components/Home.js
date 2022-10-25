import firestore from '@react-native-firebase/firestore';
import * as React from 'react';
import {useState, useEffect} from 'react';

import {StyleSheet, Button, View, Text, ScrollView} from 'react-native';

function Home({navigation}) {
  let [courseList, updateCourseList] = useState([]);

  // get courses from firestore database
  async function getCourses() {
    await firestore()
      .collection('Courses')
      .get()
      .then(querySnapshot => {
        // loop over every course in the 'Courses' collection in the firestore database and add course to courseList[]
        querySnapshot.forEach(doc => {
          try {
            tempDoc = [];
            let courseData = doc.data();
            const holeCount = Object.keys(courseData.Hole_GPS).length;
            // push course jsx template to a tempDoc that can be added to courseList Array, will add
            // courseList to scroll view to populate all courses
            tempDoc.push(
              <View style={styles.course_container} key={doc.id}>
                <Text style={styles.course_name}>{courseData.Course}</Text>
                <Text style={styles.course_info}>
                  {' '}
                  {holeCount} Holes{'  '} | {'  '} Par {courseData.par} {'  '} |
                  {'  '}
                  {'  '}
                  {courseData.yardage}
                  yd
                </Text>
                <View style={styles.button}>
                  <Button
                    color="#00655F"
                    title="Select"
                    textTitle={{fontFamily: 'Jaldi-Regular'}}
                    onPress={() => {
                      // navigate to selected course and add props to pass to main app so
                      // that the selected course is loaded and have hole count to populate holes in scroll view
                      navigation.navigate('Mainapp', {
                        courseId: doc.id,
                        holeCt: holeCount,
                      });
                    }}
                  />
                </View>
              </View>,
            );
            // add new course(temp Doc) to list of courses
            updateCourseList(oldCourses => [...oldCourses, tempDoc]);
          } catch (err) {
            console.log(
              `Error retrieving course data from cloud firestore for document id: ${doc.id}: ${err}`,
            );
          }
        });
      });
  }

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <View style={styles.main_container}>
      <View style={styles.circle}></View>
      <View style={styles.background_square}></View>
      <View style={styles.header_box}>
        <Text style={styles.header}>GOLF GPS</Text>
      </View>
      <Text style={styles.select_course}>Select Course</Text>
      {/* Scroll View will populate all courses in courseList from database */}
      <ScrollView style={styles.scroll_container}>{courseList}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#100F11',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  select_course: {
    position: 'absolute',
    width: 185,
    height: 35,
    top: 170,
    fontFamily: 'Jaldi-Regular',
    fontSize: 24,
    letterSpacing: 0.08,
    textAlign: 'center',
  },
  scroll_container: {
    width: 350,
    height: 480,
    position: 'absolute',
    top: 225,
    overflow: 'scroll',
  },
  course_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 185,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  course_name: {
    fontFamily: 'Jaldi-Regular',
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: 0.08,
  },
  course_info: {
    fontFamily: 'Jaldi-Regular',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    height: 50,
    width: 200,
  },
  header_box: {
    display: 'flex',
    position: 'absolute',
    width: 500,
    height: 100,
    top: 50,
    backgroundColor: '#100F11',
    borderColor: '#00655F',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 64,
    letterSpacing: 1,
    fontFamily: 'Jaldi-Regular',
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

export default Home;
