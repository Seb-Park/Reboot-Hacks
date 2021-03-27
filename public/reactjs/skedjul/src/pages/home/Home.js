import firebase from "firebase/app";
import "firebase/auth";

import ForceSignIn from "../../global_components/ForceSignIn"

import logo from '../../logo.svg';


export default function Home() {
  return ForceSignIn(
    <div className="App">
      <header className="App-header">
        <div className="Home-Page-Main">
          <h1 class="home-page-title">Skedjul</h1>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h2 class="home-page-subtitle">Hello{firebase.auth().currentUser ? ", " + firebase.auth().currentUser.displayName : ""}.</h2>
          {/* <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a> */}
        <div className="home-enter-button">Enter Workspace</div>

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