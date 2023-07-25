<template>
  <v-sheet width="300" class="mx-auto">
    <v-form @submit.prevent="submit">
      <multiselect
        :class="['multiselect-dropdown']"
        v-model="community"
        :options="communities"
        label="name"
        @search-change="getCommunities"
        :loading="loading"
        :hide-selected="true"
      ></multiselect>
      <v-text-field v-model="token"></v-text-field>
      <v-btn type="submit" block class="mt-2" :loading="loading">Submit</v-btn>
    </v-form>
    <button @click="initializeFirebase" type="button" class="btn btn-primary">
      Get token
    </button>
    <p v-if="token">{{ token }}</p>
    <p v-else>{{ message }}</p>
  </v-sheet>
</template>
<script>
import * as firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  components: { Multiselect },
  name: "InitPush",
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
      token: "Test",
      message: "",
      community: "",
      communities: [],
    };
  },
  watch: {
    community(val) {
      val && this.getCommunities(val);
    },
  },
  mounted() {
    console.log("community", this.community);
    // this.enableNotifications();
    // this.initializeFirebase();
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
    async getCommunities(val) {
      const { data } = await axios.get(
        process.env.VUE_APP_API_URL + "/regions" + (val ? "?q=" + val : "")
      );
      console.log(data.data);
      this.communities = data.data;
    },
    async submit() {
      this.loading = true;
      const results = await axios.post(
        process.env.VUE_APP_API_URL + "/check-region",
        {
          token: this.token,
          community: this.community,
        }
      );
      this.loading = false;
      alert(JSON.stringify(results, null, 2));
    },
  },
};
</script>
<style>
.multiselect-dropdown {
  background: #f6f6f6;
  border-bottom: 1px #a5a5a5 solid;
  padding: 15px;
  text-align: left;
}
.multiselect__content {
  padding: 0;
  width: 100%;
}
.multiselect__content li {
  list-style-type: none;
  margin: 0;
}
.multiselect__content li .multiselect__option {
  background: #f6f6f6;
  padding: 15px;
  text-align: left;
  display: block;
}
.multiselect__content li .multiselect__option:hover {
  background: gray;
  cursor: pointer;
  transition: 0.7;
}
.multiselect__content .multiselect__element .multiselect__option--highlight {
  background: gray;
}
</style>
