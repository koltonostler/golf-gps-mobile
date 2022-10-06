import * as React from 'react';
import {
  StyleSheet,
  Button,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

function Home({navigation}) {
  return (
    <View style={styles.main_container}>
      <View style={styles.circle}></View>
      <View style={styles.background_square}></View>
      <View style={styles.header_box}>
        <Text style={styles.header}>GOLF GPS</Text>
      </View>
      <Text style={styles.select_course}>Select Course</Text>
      <ScrollView style={styles.scroll_container}>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
        <View style={styles.course_container}>
          <Text style={styles.course_name}>Thunderbird Golf Course</Text>
          <Text style={styles.course_info}>9 Holes | Par 31 | 2,053yd</Text>
          <View style={styles.button}>
            <Button
              color="#00655F"
              title="Select"
              textTitle={{fontFamily: 'Jaldi-Regular'}}
              onPress={() => navigation.navigate('Details')}
            />
          </View>
        </View>
      </ScrollView>
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
    width: 325,
    height: 480,
    position: 'absolute',
    top: 225,
    overflow: 'scroll',
  },
  course_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 325,
    height: 150,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  course_name: {
    fontFamily: 'Jaldi-Regular',
    fontSize: 32,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: 0.08,
    marginBottom: -5,
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
    borderColor: '#00655F',
    borderWidth: 1,
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
    backgroundColor: '#151516',
    top: 100,
  },
  background_square: {
    position: 'absolute',
    width: 500,
    height: 300,
    backgroundColor: '#151516',
    top: 0,
  },
});

export default Home;
