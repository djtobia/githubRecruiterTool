<template>
<div>
    <div v-for="(user, index) in users" :key="index">
        <div class="row">
            <div class="col-md-3">
                {{ user.login }}
            </div>
            <div class="col-md-3">
                {{ user.html_url }}
            </div>
            <div class="col-md-6 red"></div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name:'Users',
    data() {
        return {
            users: {
                type: Array,
                default() {
                    return [];
                }
            }
        }
    },
    mounted() {
        axios.get('https://api.github.com/search/users', 
        {
            headers : {
                'Accept': 'application/vnd.github.v3+json'
                },
            params: {
                q: 'djtobia'
                }
        }).then(
      (response) => {
          let index = 0;
        //   console.log(response.data);
        for(let item of response.data.items){
            console.log(item);
            this.users[index] = item;
            index++;
        }
      }
    )
  }
}
</script>

<style lang="less" scoped>
.red { 
    background-color: red;
}
</style>