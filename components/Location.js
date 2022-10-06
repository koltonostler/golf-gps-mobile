import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import appConfig from '../app.json';

const Location = props => {
  const centerLat = props.centerLat;
  const centerLon = props.centerLon;
  const backLat = props.backLat;
  const backLon = props.backLon;
  const frontLat = props.frontLat;
  const frontLon = props.frontLon;

  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);

  const watchId = useRef(null);

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

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        console.log(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
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
        console.log(position);
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
        enableHighAccuracy: highAccuracy,
        distanceFilter: 0,
        interval: 10,
        fastestInterval: 10,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
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
    <View>
      <ScrollView>
        <View>
          <Button title="Get Location" onPress={getLocation} />
          <View>
            <Button
              title="Start Observing"
              onPress={getLocationUpdates}
              disabled={observing}
            />
            <Button
              title="Stop Observing"
              onPress={removeLocationUpdates}
              disabled={!observing}
            />
          </View>
        </View>
        <View>
          <Text>Latitude: {location?.coords?.latitude || ''}</Text>
          <Text>Longitude: {location?.coords?.longitude || ''}</Text>
          <Text>Heading: {location?.coords?.heading}</Text>
          <Text>Accuracy: {location?.coords?.accuracy}</Text>
          <Text>Altitude: {location?.coords?.altitude}</Text>
          <Text>Altitude Accuracy: {location?.coords?.altitudeAccuracy}</Text>
          <Text>Speed: {location?.coords?.speed}</Text>
          <Text>Provider: {location?.provider || ''}</Text>
          <Text>
            Back: {backYardage}
            {'\n'}
            Center: {centerYardage}
            {'\n'}
            Front: {frontYardage}
            {'\n'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Location;
