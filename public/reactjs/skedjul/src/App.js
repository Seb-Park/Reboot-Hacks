import './App.css';
import firebase from "firebase/app";
import "firebase/auth";

import Home from './pages/home/Home'
import SignIn from './pages/signin/SignIn'

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import {
  FirebaseAuthProvider,
} from "@react-firebase/auth"
import firebaseConfig from "./firebaseConf.js"


function App() {
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/signin" component={SignIn} />
        </Switch>
      </Router>
    </FirebaseAuthProvider>
  );
}

export default App;
