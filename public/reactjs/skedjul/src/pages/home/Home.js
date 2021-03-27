import firebase from "firebase/app";
import "firebase/auth";

import ForceSignIn from "../../global_components/ForceSignIn"

import logo from '../../logo.svg';


export default function Home() {
  return ForceSignIn(
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => {
          firebase.auth().signOut();
        }}>
          Sign Out
        </button>
      </header>
    </div>
  )
}