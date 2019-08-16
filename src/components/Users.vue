<template>
    <div>
        <div class="row">
            <div class="col-md-12">

                    <v-data-table :headers="tableHeaders"
                                  :items="usersInfo">
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
            tableHeaders: [
                {text: "", value: 'Avatar'},
                {text: "Username", value: 'Username'},
                {text: 'Github Url', value: 'github-url'}
            ]
        }
    };
</script>

<style lang="less" scoped>
    .square-img {
        width: 50px;
        height: 50px;
    }
</style>