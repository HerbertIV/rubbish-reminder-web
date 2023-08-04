<template>
  <header class="mb-auto">
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <h3 class="float-md-start mb-0">Rubbish reminder</h3>
        </v-col>
        <v-col cols="12" sm="6">
          <nav class="nav nav-masthead justify-content-center float-md-end">
            <router-link class="nav-link fw-bold py-1 px-0" to="/">
              <v-icon x-large color="grey darken-2">mdi-home-account</v-icon>
            </router-link>
            <router-link class="nav-link fw-bold py-1 px-0" to="/schedules">
              <v-icon x-large color="orange darken-2">
                mdi-calendar-alert
              </v-icon>
            </router-link>
          </nav>
        </v-col>
      </v-row>
    </v-container>
  </header>
</template>
<script>
export default {
  name: "HeaderComponent",
};
</script>
<style>
.nav-link:hover {
  opacity: 0.7;
  transition: 0.5s;
}
.nav-link {
  opacity: 1;
  transition: 0.5s;
}
</style>
