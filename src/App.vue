<template>
  <div id="app">
    <h1>Welcome to the Github Recruiter Tool!</h1>
    <h2>What kind of search would you like to do?</h2>
    <div class="row">
      <div class="col-md-6 col-sm-3 text-right">
        <label for="usernameInput">Username: </label>
      </div>
      <div class="col-md-6 col-sm-3 text-left">
        <input id="usernameInput" type="text" v-model="searchInputs.user">
      </div>
      <br>
      <div class="col-md-6 col-sm-3 text-right">
        <label for="locationInput">Location (can be a college): </label>
      </div>
      <div class="col-md-6 col-sm-3 text-left">
        <input id="locationInput" type="text" v-model="searchInputs.location">
      </div>
      <br>
      <div class="col-md-6 col-sm-3 text-right">
          <label for="fullnameInput">Fullname (if you know it!): </label>
      </div>
      <div class="col-md-6 col-sm-3 text-left">
        <input id="fullnameInput" type="text" v-model="searchInputs.fullname">
      </div>
      <div class="col align-self-center">
      <button class="btn btn-primary" @click='search'>Search!</button>
      </div>   
    </div>
    <h3 v-if="this.pages !== 0">There are {{ pages }} pages of data for that search result!</h3>
    <users v-if="searchResults.length !== 0" :usersInfo="searchResults"/>
  </div>
</template>

<script>
import axios from 'axios';
import users from './components/Users.vue';
export default {
  name: 'app',
  data() {
    return {
      searchInputs: { user: '', location: '', fullname: ''},
      searchResults: [],
      pages: 0
    };
  },
  components: {
    users
  },
  methods: {
    search() {
      this.searchResults = [];
      let query = 'q=';
      for(const input of Object.keys(this.searchInputs)){
          if(this.searchInputs[input] !== '')
            query += input + ':"' + this.searchInputs[input] + '" ';
      }
      query = query.trim().replace(/\s/g, '+') +"&per_page=50";
      axios.get('https://api.github.com/search/users?'+query)
      .then( response => {
        console.log(response);
        if(response.headers.link)
          this.pages = response.headers.link.split(',')[1].match(/&page=\d*[^>]/g)[0].split('=')[1];
        
        for(let item of response.data.items){
          this.searchResults.push(item);
        }
        console.log(this.searchInputs);
      })
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
