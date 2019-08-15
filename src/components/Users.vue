<template>
<div>
    <table>
        <thead>
            <th>Username</th>
            <th>URL</th>
        </thead>
        <tbody>
            <tr v-for="(user, index) in usersInfo" :key="index">
                <td>{{ user.login }}</td>
                <td>{{ user.html_url }}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name:'Users',
    props: {
        usersInfo: {}
    }
}
</script>

<style lang="less" scoped>
.red { 
    background-color: red;
}
</style>