/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  Text
 } from 'react-native';

import { PersistGate } from 'redux-persist/integration/react'
import Navigation from './app/navigation/index.js'
import { Provider } from 'react-redux';
import NavigationStack from "./app/navigation/navigationStack";

// Import the ConfigureStore that holds the initial Configuration

import configureStore from './app/store/store'
const { persistor, store } = configureStore();

// // Create a Store from the Configuration, we can pass a Initial State here

console.disableYellowBox = true;

export default class Caregiver extends Component {
  constructor() {
    super();
  }

  render() {
    try{
     return (
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          <NavigationStack/>
        </PersistGate>
      </Provider>
      );
    }catch(error){
      console.log(error,"crash->>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
  }
}
