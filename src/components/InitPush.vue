<template>
  <v-sheet width="300" class="mx-auto">
    <v-form @submit.prevent="submit">
      <Multiselect
        :optionsStatic="communities"
        v-model="community"
        :url="urlToCommunities"
      >
      </Multiselect>
      <v-text-field ref="token" v-model="token"></v-text-field>
      <v-btn type="submit" block class="mt-2" :loading="loading">Submit</v-btn>
    </v-form>
    <button
      v-if="!token"
      @click="initializeFirebase"
      type="button"
      class="btn btn-primary mt-3"
    >
      Get token
    </button>
    <div>
      <div v-if="token">
        <button
          type="button"
          @click="copyToClipboard"
          class="btn btn-info mt-3"
        >
          Copy token
        </button>
      </div>
      <div v-else>
        {{ message }}
      </div>
    </div>
  </v-sheet>
</template>
<script>
import * as firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";
import Multiselect from "@/components/inputs/Multiselect";

export default {
  name: "InitPush",
  components: { Multiselect },
  data() {
    return {
      loading: false,
      // use a getter and setter to watch the user's notification preference in local storage
      get requestPermission() {
        return localStorage.getItem("notificationPref") === null;
      },
      set requestPermission(value) {
        localStorage.setItem("notificationPref", value);
      },
      token: "",
      urlToCommunities: process.env.VUE_APP_API_URL + "/regions",
      message: "",
      community: "",
      communities: [],
    };
  },
  mounted() {
    // if (!this.token) {
    //   this.enableNotifications();
    // }
    // if (this.communities.length === 0) {
    //   this.getCommunities();
    // }
  },
  methods: {
    registerToken(token) {
      this.token = token;
      axios
        .get(process.env.VUE_APP_API_URL + "/check", {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "device-key": token,
            "device-type": "web",
          },
        })
        .then();
    },
    copyToClipboard() {
      const token = this.$refs.token;
      // Wybierz tekst w elemencie textarea
      token.select();
      // Skopiuj wybrany tekst do schowka
      document.execCommand("copy");
    },
    enableNotifications() {
      this.message = Notification.permission;
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

    async initializeFirebase() {
      if (firebase.messaging.isSupported() && !this.token) {
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
    async submit() {
      this.loading = true;
      if (!this.token) {
        await this.initializeFirebase();
      }
      if (this.token) {
        await axios.post(
          process.env.VUE_APP_API_URL + "/check-region",
          {
            region_id: this.community.id,
          },
          {
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "device-key": this.token,
              "device-type": "web",
            },
          }
        );
      }
      this.loading = false;
    },
  },
};
</script>
