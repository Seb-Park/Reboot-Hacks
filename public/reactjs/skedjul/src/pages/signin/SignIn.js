import firebase from "firebase/app";
import "firebase/auth";

import { useHistory } from "react-router-dom";

export default function SignIn() {
  return (
    <div>
      <SignInButton/>
    </div>
  );
}

function SignInButton() {
  const history = useHistory();

  return (
    <button onClick={() => {
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
        }, 10);      });
    }}>
      Sign in with Google
    </button>
  )
}