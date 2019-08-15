<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <table>
          <thead>
            <th>Avatar</th>
            <th>Username</th>
            <th>URL</th>
          </thead>
          <tbody>
            <tr v-for="(user, index) in usersInfo" :key="index">
              <td>
                <div class="col-md-2">
                  <img class="square-img" :src="user.avatar_url" alt="avatar index" />
                </div>
              </td>
              <td>
                <div class="col-md-3">{{ user.login }}</div>
              </td>
              <td>
                <div class="col-md-5">
                  <a :href="user.html_url">{{ user.html_url }}</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
  props: {
    usersInfo: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.square-img {
  width: 50px;
  height: 50px;
}
</style>