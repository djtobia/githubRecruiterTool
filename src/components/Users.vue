<template>
    <div>
        <div class="row">
            <div class="col-md-12">

                <v-data-table :headers="tableHeaders"
                              :items="usersInfo"
                              :disable-sort="true"
                              :server-items-length="totalItems > 1000 ? 1000 : totalItems"
                              :items-per-page="itemsPerPage"
                              :page.sync="currentPage"
                              :loading="loading"
                              :no-data-text="'Sadly, Github only allows you to see the first 1000 results.'"
                              :footer-props="{
                                itemsPerPageOptions: [5,10,25,50,100],
                                showFirstLastPage: true
                              }"
                              @update:options="updateOptions($event)"
                >
                    <template slot="item.avatar_url" slot-scope="props">
                        <img :src="props.item.avatar_url" class="square-img" alt="users avatar"/>
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
            originalQueryString: {
                type: String,
                default: ''
            }
        },
        watch: {
            originalQueryString(value) { // watch it
                this.originalQueryString = value;
                this.query = value;
                this.fetchSearchResults();
            }
        },
        data() {
            return {
                tableHeaders: [
                    {text: "", value: 'avatar_url'},
                    {text: "Username", value: 'username'},
                    {text: 'Github Url', value: 'url'}
                ],
                usersInfo: [],
                pages: 0,
                totalItems: 0,
                currentPage: 1,
                itemsPerPage: 10,
                query: '',
                loading: false
            };
        },
        mounted() {
            this.query = this.originalQueryString;
            this.fetchSearchResults();
        },
        methods: {
            fetchSearchResults() {
                this.usersInfo.splice(0, this.usersInfo.length);
                this.loading = true;
                if (this.query !== '') {
                    if (!this.query.match('&per_page=')) {
                        this.query = this.query + '&per_page=' + this.itemsPerPage;
                    }
                    axios.get('https://api.github.com/search/users?' + this.query)
                        .then(response => {
                            this.totalItems = response.data.total_count;
                            if (response.headers.link)
                                this.pages = response.headers.link.split(',')[1].match(/&page=\d*[^>]/g)[0].split('=')[1];

                            for (let item of response.data.items) {
                                this.usersInfo.push(this.formatItem(item));
                            }
                            this.loading = false;
                        });
                }
            },
            formatItem(item) {
                let newItem = {};
                newItem['avatar_url'] = item.avatar_url;
                newItem['username'] = item.login;
                newItem['url'] = item.html_url;
                return newItem;
            },
            updateOptions(newOptions) {
                this.itemsPerPage = newOptions.itemsPerPage;
                this.currentPage = newOptions.page;
                let newQuery = this.formatQueryString();
                if (newQuery) {
                    this.query = newQuery;
                }
                this.fetchSearchResults()
            },
            formatQueryString() {
                let index = null;
                if (this.query.match('&per_page=')) {
                    index = this.query.match('&per_page=').index;
                } else {
                    return '';
                }
                if (index != null) {
                    return this.query.slice(0, index) + '&per_page=' + this.itemsPerPage + '&page=' + this.currentPage;
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