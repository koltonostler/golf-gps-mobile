import React, {useCallback, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Switch,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import appConfig from '../app.json';

const Location = props => {
  // get props from Mainapp component
  const centerLat = props.centerLat;
  const centerLon = props.centerLon;
  const backLat = props.backLat;
  const backLon = props.backLon;
  const frontLat = props.frontLat;
  const frontLon = props.frontLon;

  // initialize state variables for location
  const [observing, setObserving] = useState(false);
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisable] = useState(false);
  const watchId = useRef(null);

  // location permission setup.  From https://github.com/Agontuk/react-native-geolocation-service
  useEffect(() => {
    return () => {
      removeLocationUpdates();
    };
  }, [removeLocationUpdates]);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    setObserving(true);

    watchId.current = Geolocation.watchPosition(
      position => {
        setLocation(position);
      },
      error => {
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        distanceFilter: 0,
        interval: 100,
        fastestInterval: 100,
      },
    );
  };

  const removeLocationUpdates = useCallback(() => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setObserving(false);
    }
  }, []);

  const toggleLocationUpdates = () => {
    if (!observing) {
      getLocationUpdates();
    } else {
      removeLocationUpdates();
    }
  };

  useEffect(() => {
    getLocationUpdates();
  }, []);

  // calculate distances using Haversine Formula for the current user location and current hole coordinates.
  const getYardage = (holeLon, holeLat, userLon, userLat) => {
    //convert coordinates to Radians
    holeLon = (holeLon * Math.PI) / 180;
    holeLat = (holeLat * Math.PI) / 180;
    userLon = (userLon * Math.PI) / 180;
    userLat = (userLat * Math.PI) / 180;

    // Haversine formula
    let lonDiff = userLon - holeLon;
    let latDiff = userLat - holeLat;
    let a =
      Math.pow(Math.sin(latDiff / 2), 2) +
      Math.cos(holeLat) *
        Math.cos(userLat) *
        Math.pow(Math.sin(lonDiff / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    //R adius of earth in miles
    let r = 3956;
    // difference in miles between coordinates
    let milesDiff = c * r;
    // convert to yards
    let yardarge = milesDiff * 1760;
    // return yardage
    return yardarge.toFixed(0);
  };

  // store all yardages in variables calling the getYardage function
  const frontYardage = getYardage(
    frontLon,
    frontLat,
    location?.coords?.longitude,
    location?.coords?.latitude,
  );
  const centerYardage = getYardage(
    centerLon,
    centerLat,
    location?.coords?.longitude,
    location?.coords?.latitude,
  );
  const backYardage = getYardage(
    backLon,
    backLat,
    location?.coords?.longitude,
    location?.coords?.latitude,
  );

  return (
    <View style={styles.location_container}>
      <View style={styles.yardage_container}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={styles.back_box}>
            <Text style={styles.back_text}>Back</Text>
          </View>
          <Text style={styles.back_yardage}>
            {!isNaN(backYardage) ? backYardage : ''}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.center_box}>
            <Text style={styles.center_text}>Center of Green</Text>
          </View>
          <Text style={styles.center_yardage}>
            {!isNaN(centerYardage) ? centerYardage : ''}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.back_box}>
            <Text style={styles.back_text}>Front</Text>
          </View>
          <Text style={styles.back_yardage}>
            {!isNaN(frontYardage) ? frontYardage : ''}
          </Text>
        </View>
      </View>
      <Text style={styles.select_hole}>Select Hole</Text>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisable(false)}>
        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.70)', flex: 1}}>
          <View style={styles.modal_container}>
            <View style={styles.switch_container}>
              <Switch onValueChange={toggleLocationUpdates} value={observing} />
              <Text style={styles.always_on_text}>Toggle GPS</Text>
            </View>
            <Icon
              name="close"
              size={30}
              color="#CCCCCC"
              onPress={() => setModalVisable(false)}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.bottom_nav}>
        <Icon
          name="settings"
          size={30}
          color="#CCCCCC"
          onPress={() => setModalVisable(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  location_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back_box: {
    bottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 35,
    borderBottomColor: '#00655F',
    borderBottomWidth: 2,
  },
  back_text: {
    fontSize: 20,
    fontFamily: 'Recursive-Regular',
    letterSpacing: 0.08,
  },
  back_yardage: {
    bottom: 12,
    fontSize: 50,
    fontFamily: 'Recursive-Regular',
  },
  center_box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 175,
    height: 45,
    borderBottomColor: '#00655F',
    borderBottomWidth: 2,
  },
  center_text: {
    fontSize: 24,
    fontFamily: 'Recursive-Regular',
    letterSpacing: 0.08,
    includeFontPadding: false,
  },
  center_yardage: {
    bottom: 20,
    fontSize: 120,
    fontFamily: 'Recursive-Regular',
  },
  yardage_container: {
    bottom: 10,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 350,
    width: 350,
  },
  always_on_text: {
    fontFamily: 'Jaldi-Regular',
    fontSize: 20,
  },
  switch_container: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: 175,
  },
  select_hole: {
    position: 'absolute',
    width: 185,
    height: 35,
    bottom: 125,
    fontFamily: 'Jaldi-Regular',
    fontSize: 20,
    letterSpacing: 0.08,
    textAlign: 'center',
  },
  button_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00655F',
    position: 'absolute',
    bottom: 165,
    height: 45,
    width: 180,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
  },
  modal_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#252525',
  },
  bottom_nav: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    paddingHorizontal: 50,
    backgroundColor: '#151516',
  },
});

export default Location;
