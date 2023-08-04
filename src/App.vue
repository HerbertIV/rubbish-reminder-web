<template class="d-flex h-100 text-center text-bg-dark">
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card class="pa-2" outlined tile>
          <div
            class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column"
          >
            <Header />
            <router-view></router-view>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Header from "@/components/layout/Header";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: darkcyan;
}
</style>
