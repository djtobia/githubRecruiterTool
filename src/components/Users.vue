<template>
    <v-app>
        <div class="row">
            <div class="col-md-12">

                <v-data-table :headers="tableHeaders"
                              :items="usersInfo"
                              :disable-sort="true"
                              :server-items-length="totalItems > 1000 ? 1000 : totalItems"
                              :items-per-page="itemsPerPage"
                              :page.sync="currentPage"
                              :loading="loading"
                              :footer-props="{
                                itemsPerPageOptions: [5,10,25,50,100],
                                showFirstLastPage: true
                              }"
                              :show-expand="true"
                              @update:options="updateOptions($event)"
                >
                    <template slot="item.avatar_url" slot-scope="props">
                        <img :src="props.item.avatar_url" class="square-img" alt="users avatar"/>
                    </template>
                    <template slot="item.url" slot-scope="props">
                        <a :href="props.item.url" target="_blank">{{props.item.url}}</a>
                    </template>
                    <template slot="item.hireable" slot-scope="props">
                        <v-chip :color="getColor(props.item.hireable)" dark>{{props.item.hireable}}</v-chip>

                    </template>
                    <template slot="expanded-item" slot-scope="props">
                        <td :colspan="tableHeaders.length-2">Bio: {{ props.item.bio }}</td>
                        <td :colspan="2">Website :
                            <span v-if="props.item.website !== 'None Listed'"><a
                                    :href="props.item.website" target="_blank">{{ props.item.website }}</a></span>
                            <span v-else>None Listed</span></td>
                    </template>
                </v-data-table>
            </div>
        </div>
    </v-app>
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
                    {text: 'Github Url', value: 'url'},
                    {text: 'Name', value: 'name'},
                    {text: 'Email', value: 'email'},
                    {text: 'Company', value: 'company'},
                    {text: 'Location', value: 'location'},
                    {text: 'Hireable', value: 'hireable'}
                ],
                usersInfo: [],
                usersInfoSecondary: [],
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
                    axios.get('https://api.github.com/search/users?' + this.query, {
                        auth: {
                            username: 'djtobia',
                            password: process.env.VUE_APP_API_KEY
                        }
                    })
                        .then(response => {
                            this.totalItems = response.data.total_count;
                            if (response.headers.link)
                                this.pages = response.headers.link.split(',')[1].match(/&page=\d*[^>]/g)[0].split('=')[1];
                            let index = 0;
                            for (let item of response.data.items) {
                                axios.get('https://api.github.com/users/' + item.login, {
                                    auth: {
                                        username: 'djtobia',
                                        password: process.env.VUE_APP_API_KEY
                                    },
                                }).then(response2 => {
                                    this.usersInfo.push(this.formatItem(item, response2.data, index++));
                                })
                            }
                            this.loading = false;
                        });
                }
            },
            formatItem(searchInfo, userInfo, index) {
                let website = userInfo.blog;
                if (website && website.search('http') === -1) {
                    website = 'http://' + website;
                }
                let newItem = {};
                newItem['id'] = index;
                newItem['avatar_url'] = searchInfo.avatar_url;
                newItem['username'] = searchInfo.login;
                newItem['url'] = searchInfo.html_url;
                newItem['website'] = website ? website : 'None Listed';
                newItem['bio'] = userInfo.bio ? userInfo.bio : 'None Listed';
                newItem['location'] = userInfo.location ? userInfo.location : 'None Listed';
                newItem['company'] = userInfo.company ? userInfo.company : 'None Listed';
                newItem['email'] = userInfo.email ? userInfo.email : 'None Listed';
                newItem['name'] = userInfo.name ? userInfo.name : 'None Listed';
                newItem['hireable'] = userInfo.hireable ? 'Yes' : 'No';
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
            },
            getColor(hireable) {
                return hireable === 'No' ? 'red' : 'green';
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