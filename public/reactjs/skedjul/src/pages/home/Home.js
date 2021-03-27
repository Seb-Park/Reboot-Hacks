import firebase from "firebase/app";
import "firebase/auth";
import { useHistory } from "react-router";

import ForceSignIn from "../../global_components/ForceSignIn"

import './Home.css';


export default function Home() {
  const history = useHistory();
  return ForceSignIn(
    <div className="App">
      <header className="App-header">
        <div className="Home-Page-Main">
          <h1 className="home-page-title">Skedjul</h1>
          <h2 className="home-page-subtitle">Hello{firebase.auth().currentUser ? ", " + firebase.auth().currentUser.displayName : ""}.</h2>
        <div className="home-enter-button" onClick={() => {
          history.push('/schedule')
        }}>
          Enter Workspace</div>
          <div className="home-sign-out-container">
            <div className="home-sign-out-button" onClick={() => {
              firebase.auth().signOut();
            }}>
              Sign Out
          </div>
          </div>
        </div>
      </header>
    </div>
  )
}