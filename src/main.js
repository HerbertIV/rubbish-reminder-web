import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import * as firebase from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAhixKv2Ah_QXF96gOUF2zxpoec2JFhsPg",
  authDomain: "rubishback.firebaseapp.com",
  projectId: "rubishback",
  storageBucket: "rubishback.appspot.com",
  messagingSenderId: "163284422021",
  appId: "1:163284422021:web:1b14da1eee2698000608ec",
  measurementId: "G-SLEPT38EC0",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.usePublicVapidKey(
  "BNK8tMAoXcmJqCU4t-FLyufAk2FjFEB5e6xVweo8Scrs-k1jZMe5WUnk5R6HQV2sf3aE0Gfmpf_lTU8BTCIMTV8"
); // 1. Generate a new key pair
// Request Permission of Notifications
messaging
  .requestPermission()
  .then(() => {
    console.log("Notification permission granted.");
    // Get Token
    messaging.getToken().then((token) => {
      console.log(token);
    });
  })
  .catch((err) => {
    console.log("Unable to get permission to notify.", err);
  });

createApp(App).mount("#app");
