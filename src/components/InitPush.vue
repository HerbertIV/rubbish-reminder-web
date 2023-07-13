<template>
  <button v-if="token" @click="initializeFirebase">INIT token</button>
</template>
<script>
import * as firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";

export default {
  name: "InitPush",
  data() {
    return {
      // use a getter and setter to watch the user's notification preference in local storage
      get requestPermission() {
        return localStorage.getItem("notificationPref") === null;
      },
      set requestPermission(value) {
        localStorage.setItem("notificationPref", value);
      },
      token: "",
    };
  },
  mounted() {
    this.initializeFirebase();
  },
  methods: {
    registerToken(token) {
      console.log("s", token);
      axios
        .get(process.env.VUE_APP_API_URL + "/check", {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "device-key": token,
            "device-type": "web",
          },
        })
        .then(() => {
          this.token = token;
        });
    },

    enableNotifications() {
      if (!("Notification" in window)) {
        alert("Notifications are not supported");
      } else if (Notification.permission === "granted") {
        this.initializeFirebase();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            this.initializeFirebase();
          }
        });
      } else {
        alert("No permission to send notification");
      }
      this.requestPermission = Notification.permission;
    },

    initializeFirebase() {
      if (firebase.messaging.isSupported()) {
        let config = {
          apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
          authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
          storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.VUE_APP_FIREBASE_APP_ID,
          measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
        };
        !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
        const messaging = firebase.messaging();
        messaging.usePublicVapidKey(
          "BNK8tMAoXcmJqCU4t-FLyufAk2FjFEB5e6xVweo8Scrs-k1jZMe5WUnk5R6HQV2sf3aE0Gfmpf_lTU8BTCIMTV8"
        );
        messaging
          .requestPermission()
          .then(() => {
            console.log("Notification permission granted.");
            // Get Token
            messaging.getToken().then((token) => {
              this.registerToken(token);
            });
          })
          .catch((err) => {
            console.log("Unable to get permission to notify.", err);
          });
      }
    },
  },
};
</script>
