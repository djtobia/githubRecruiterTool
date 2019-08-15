<template>
  <div id="app">
    <h1>Welcome to the Github Recruiter Tool!</h1>
    <h2>What kind of search would you like to do?</h2>
    <div class="row">
      <div class="col-md-6 text-right">
        <label for="usernameInput">Username: </label>
      </div>
      <div class="col-md-6 text-left">
        <input id="usernameInput" type="text" v-model="searchInputs.username">
      </div>
      <br>
      <div class="col-md-6 text-right">
        <label for="locationInput">Location: </label>
      </div>
      <div class="col-md-6 text-left">
        <input id="locationInput" type="text" v-model="searchInputs.location">

      </div>
      <div class="col align-self-center">
      <button class="btn btn-primary" @click='search'>Search!</button>
      </div>   
    </div>
    <users v-if="Object.keys(searchResults).length !== 0"/>
  </div>
</template>

<script>
import axios from 'axios';
import users from './components/Users.vue';
export default {
  name: 'app',
  data() {
    return {
      searchInputs: { username: '', location: ''},
      searchResults: {}
    };
  },
  components: {
    users
  },
  methods: {
    search() {
      
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
