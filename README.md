# Golf GPS

## About

Golf GPS is an Android application created using React-Native that allows the user to get the yardage from their current device location to the center, front, and back of the selected green.  Courses are imported using Firebase Firestore - a NoSQL database populated by myself with a few local golf courses.    



<details>
<summary>App Preview</summary>

  <p align="center">
    <img src="https://user-images.githubusercontent.com/95270713/197870542-2ad94e74-ffc7-4c57-a79f-da45df873354.png">
    <img src="https://user-images.githubusercontent.com/95270713/197870647-cb975b3d-b992-4b1e-9e3e-c46e32c348d2.png">
  </p>
</details>

#### Video Demo: https://youtu.be/sXMriEYPeRQ

Calculations for the distance between coordinates was done using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula).

## Environment Setup

This app was created using React Native CLI Quickstart using Windows OS and was made for Android OS.  To ensure proper setup, follow the [environment setup guide](https://reactnative.dev/docs/environment-setup) for React Native CLI quickstart. 

Setup will include installing the following tools:

1. Android Studio
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
2. Java SE Development Kit(JDK)
   - It is recommended that you install JDK version 11 as newer versions may cause problems.
3. Node


## Installation

To install all dependencies run:
 
```
yarn install
```

#### Main Dependencies

- React Native Firebase
- React Native Firebase Firestore
- React Navigation
- React Native Geolocation Service
  - for more info on this library see the [github repo](https://github.com/Agontuk/react-native-geolocation-service).


### Running the App

This project was built primarily for Android OS and was tested using an Android Emulator using Android S v12(API 31).

You can either use an Android emulator or plugin a physical android device to your computer to run the app.

I would recommend running the metro server in a seperate terminal. If you wish to do this, open a new terminal in your IDE and run this command:

```
yarn start
```
or
```
npm start
```


To start the app, run the following command to install the app and run: 

```
npx react-native run-android
```
If you haven't started the metro development server in a seperate terminal it will open a node terminal seperate from your IDE to run the dev server.
