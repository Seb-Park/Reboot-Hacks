import firebase from "firebase/app"
import "firebase/functions";
import firebaseConfig from "../firebaseConf.js"
firebase.initializeApp(firebaseConfig)


export let getSchedule = firebase.functions().httpsCallable('getSchedule');
export let getEvents = firebase.functions().httpsCallable('getEvents');
export let createEvent = firebase.functions().httpsCallable('createEvent');