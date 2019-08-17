<template>
    <div>
        <div class="row">
            <div class="col-md-12">

                <v-data-table :headers="tableHeaders"
                              :items="usersInfo"
                              :items-per-page="50"
                              :footer-props="{
                                itemsPerPageText: '',
                                itemsPerPageOptions: [50]
                                }"   >
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
            queryString: {
                type: String,
                default: ''
            }
        },
        watch: {
            queryString(value) { // watch it
                this.queryString = value;
                this.fetchSearchResults();

            }
        },
        data() {
            return {
                tableHeaders: [
                    {text: "", value: 'avatar_url', sortable: false},
                    {text: "Username", value: 'username'},
                    {text: 'Github Url', value: 'url'}
                ],
                usersInfo: [],
                pages: 0,
                pagination: {
                    itemsPerPage: 50
                }
            };
        },
        mounted() {
            this.fetchSearchResults();
        },
        methods: {
            fetchSearchResults() {
                this.usersInfo = [];
                if (!this.queryString == '')
                    axios.get('https://api.github.com/search/users?' + this.queryString)
                        .then(response => {
                            console.log(response);
                            if (response.headers.link)
                                this.pages = response.headers.link.split(',')[1].match(/&page=\d*[^>]/g)[0].split('=')[1];

                            for (let item of response.data.items) {
                                this.usersInfo.push(this.formatItem(item));
                            }
                        })
            },
            formatItem(item) {
                let newItem = {};
                newItem['avatar_url'] = item.avatar_url;
                newItem['username'] = item.login;
                newItem['url'] = item.html_url;
                return newItem;
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