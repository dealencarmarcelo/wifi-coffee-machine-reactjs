import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAPK9HpfNwjr7AQjYVrWQilQDI9wue2x_g",
    authDomain: "coffee-machine-wifi.firebaseapp.com",
    databaseURL: "https://coffee-machine-wifi-default-rtdb.firebaseio.com",
    projectId: "coffee-machine-wifi",
    storageBucket: "coffee-machine-wifi.appspot.com",
    messagingSenderId: "5762177961",
    appId: "1:5762177961:web:ef157b941a55ea24e2c2b8"
};

export const firebaseImpl = firebase.initializeApp(config);
export const firebaseDatabase = firebase.database();