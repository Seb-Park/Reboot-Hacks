import firebase from "firebase/app"
import "firebase/functions";
import firebaseConfig from "../firebaseConf.js"
firebase.initializeApp(firebaseConfig)


export let getSchedule = firebase.functions().httpsCallable('getSchedule');
export let getCurrentScheduleCallable = firebase.functions().httpsCallable('getCurrentScheduleCallable');
export let createEvent = firebase.functions().httpsCallable('createEvent');
