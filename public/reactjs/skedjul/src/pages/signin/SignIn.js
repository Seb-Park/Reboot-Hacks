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
        history.push('/home');
      }).catch((error) => { 
        console.log(error);
        history.push('/signin/failed');
      });
    }}>
      Sign in with Google
    </button>
  )
}