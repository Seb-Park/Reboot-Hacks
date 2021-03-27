import './App.css';
import firebase from "firebase/app"
import "firebase/auth";
import "firebase/functions";
import firebaseConfig from "./firebaseConf.js"


import Home from './pages/home/Home'
import SignIn from './pages/signin/SignIn'
import Schedule from './pages/schedule/Schedule'

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import {
  FirebaseAuthProvider,
} from "@react-firebase/auth"

function App() {
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/schedule" component={Schedule} />
        </Switch>
      </Router>
    </FirebaseAuthProvider>
  );
}

export default App;
