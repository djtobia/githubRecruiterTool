<template>
    <div>
        <div class="row">
            <div class="col-md-12">

                <v-data-table :headers="tableHeaders"
                              :items="usersInfo"
                              :server-items-length="totalItems"
                              :items-per-page="itemsPerPage"
                              :page.sync="currentPage"
                              :loading="loading"
                              :options.sync="itemsPerPage = $event"
                >
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
            originalQueryString: {
                type: String,
                default: ''
            }
        },
        watch: {
            originalQueryString(value) { // watch it
                this.originalQueryString = value;
                this.query = value;
                this.fetchSearchResults(this.query);
            },
            currentPage(page) {
                if(this.query.match('&page=')) {
                  let index = this.query.lastIndexOf('=');
                  let newQuery = this.query.slice(0, index + 1);
                  this.fetchSearchResults(newQuery + page);
                } else {
                  this.query += '&page=' + page;
                }
            },
            itemsPerPage() {
              console.log('in here');
              let index = this.query.match('&per_page=');
              if(index !== -1){
                  let newQuery = this.query.slice(0, index+1);
                  this.fetchSearchResults(newQuery+'&perPage='+ this.itemsPerPage + '&page='+this.currentPage)
              }
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
                totalItems: 0,
                currentPage: 1,
                itemsPerPage: 10,
                query: '',
                loading: false
            };
        },
        mounted() {
          this.query = this.originalQueryString;
          this.fetchSearchResults(this.originalQueryString);
        },
        methods: {
            fetchSearchResults(query) {
                this.usersInfo = [];
                this.loading = true;
                if (!query == '')
                    if(!query.match('&per_page=')) {
                      query += '&per_page=' + this.itemsPerPage;
                    }
                    axios.get('https://api.github.com/search/users?' + query)
                        .then(response => {
                            this.totalItems = response.data.total_count;
                            if (response.headers.link)
                                this.pages = response.headers.link.split(',')[1].match(/&page=\d*[^>]/g)[0].split('=')[1];

                            for (let item of response.data.items) {
                                this.usersInfo.push(this.formatItem(item));
                            }
                            this.loading = false;
                        })
            },
            formatItem(item) {
                let newItem = {};
                newItem['avatar_url'] = item.avatar_url;
                newItem['username'] = item.login;
                newItem['url'] = item.html_url;
                return newItem;
            },
        }
    };
</script>

<style lang="less" scoped>
    .square-img {
        width: 50px;
        height: 50px;
    }
</style>