<template>
    <div>
        <div class="row">
            <div class="col-md-12">

                <v-data-table :headers="tableHeaders"
                              :items="usersInfo">
                    <template slot="item.avatar_url" slot-scope="props">
                        <img :src="props.item.avatar_url" style="width: 50px; height: 50px;" alt="users avatar"/>
                    </template>
                  <template slot="item.url" slot-scope="props">
                    <a :href="props.item.url" target="_blank">{{props.item.url}}</a>
                  </template>
                </v-data-table>
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
            },
        },
        data() {
            return {
                tableHeaders: [
                    {text: "", value: 'avatar_url'},
                    {text: "Username", value: 'username'},
                    {text: 'Github Url', value: 'url'}
                ]
            };
        }
    };
</script>

<style lang="less" scoped>
    .square-img {
        width: 50px;
        height: 50px;
    }
</style>