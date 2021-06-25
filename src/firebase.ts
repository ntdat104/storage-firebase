import firebase from "firebase/app";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAxknNSHMUtBq3CYKrY1CCi9fG2wmOsXPk",
  authDomain: "auth-104.firebaseapp.com",
  projectId: "auth-104",
  storageBucket: "auth-104.appspot.com",
  messagingSenderId: "431667127727",
  appId: "1:431667127727:web:63dde77ccc5b109b7cfb5a",
};

firebase.initializeApp(config);
export const storage = firebase.storage();
