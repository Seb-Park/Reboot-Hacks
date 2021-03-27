import firebase from "firebase/app";
import "firebase/auth";
import googleIcon from './google-icon.svg';

import { useHistory } from "react-router-dom";

import './Signin.css';

export default function SignIn() {
  return (
    <div>
      <SignInButton />
    </div>
  );
}

function SignInButton() {
  const history = useHistory();

  return (
    <div className="sign-in-page">
      <h1 className="sign-in-welcome">Welcome.</h1>
      <button className="sign-in-button" onClick={() => {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(googleAuthProvider).then((result) => {
          console.log(result);
          setTimeout(() => {
            console.log("Redirecting...");
            history.replace('/home');
          }, 10);
        }).catch((error) => {
          console.log(error);
          setTimeout(() => {
            console.log("Redirecting...");
            history.replace('/signin');
          }, 10);
        });
      }}> <img className="google-icon" src={googleIcon} height="18px" />
      <div className="sign-in-button-text">Sign in with Google</div>
    </button>
    </div>
  )
}