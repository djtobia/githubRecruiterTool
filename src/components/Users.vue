<template>
    <div>
        <div v-if="usersInfo.length > 0">
            <v-row justify="center">
                <v-col cols="12" md="3">
                    <v-text-field v-model="filename"
                                  label="Enter filename. Will default to 'UsersInfo.csv' (extension not required)"></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn color="yellow" v-on="on">
                                <download-excel
                                        :data="usersInfo"
                                        :fields="exportfields"
                                        type="csv"
                                        :name="filename + '.csv'">
                                    Click here to export this table
                                </download-excel>
                            </v-btn>
                        </template>
                    </v-tooltip>

                </v-col>
            </v-row>
        </div>
        <v-row>
            <v-col cols="12">

                <v-data-table :headers="tableHeaders"
                              :items="usersInfo.length >= itemsPerPage || totalItems <= itemsPerPage ? usersInfo : []"
                              :items-per-page="itemsPerPage"
                              :page.sync="currentPage"
                              :loading="loading"
                              :footer-props="{
                                itemsPerPageOptions: [5,10,25,50,100],
                                showFirstLastPage: true
                              }"
                              :show-expand="true"
                >
                    <template slot="item.avatar_url" slot-scope="props">
                        <v-img :src="props.item.avatar_url" class="square-img" alt="users avatar"/>
                    </template>
                    <template slot="item.url" slot-scope="props">
                        <a :href="props.item.url" target="_blank">{{props.item.url}}</a>
                    </template>
                    <template slot="item.email" slot-scope="props">
                        <span v-if="props.item.email !== 'None Listed'">
                            <a :href="'mailto:' + props.item.email">{{ props.item.email }}</a>
                        </span>
                        <span v-else>
                            None Listed
                        </span>

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
            </v-col>
        </v-row>
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
            },
            hireable: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            originalQueryString(value) { // watch it
                this.originalQueryString = value;
                this.query = value;
                this.fetchSearchResults();
            },
            hireable(value) {
                this.hireable = value;
                this.fetchSearchResults();
            }
        },
        data() {
            return {
                tableHeaders: [
                    {text: "", value: 'avatar_url', sortable: false},
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
                queryPerPage: 100,
                query: '',
                index: 0,
                loading: false,
                exportfields: {
                    Name: 'name',
                    Hireable: 'hireable',
                    Username: 'username',
                    Email: 'email',
                    Github: 'url',
                    Company: 'company',
                    Location: 'location',
                    Bio: 'bio',
                    Website: 'website',
                    Contacted: 'None'
                },
                filename: 'UsersInfo'
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
                        this.query = this.query + '&per_page=' + this.queryPerPage;
                    }
                    axios.get('https://api.github.com/search/users?' + this.query, {
                        auth: {
                            username: process.env.VUE_APP_USERNAME,
                            password: process.env.VUE_APP_API_KEY
                        }
                    })
                        .then(response => {
                            this.totalItems = response.data.total_count > 1000 ? 1000 : response.data.total_count;
                            if (response.headers.link)
                                this.pages = response.headers.link.split(',')[1].match(/&page=\d*[^>]/g)[0].split('=')[1];
                            this.index = 0;
                            for (let item of response.data.items) {
                                axios.get('https://api.github.com/users/' + item.login, {
                                    auth: {
                                        username: process.env.VUE_APP_USERNAME,
                                        password: process.env.VUE_APP_API_KEY
                                    },
                                }).then(response2 => {
                                    if (this.hireable && response2.data.hireable)
                                        this.usersInfo.push(this.formatItem(item, response2.data, this.index++));
                                    else if (!this.hireable)
                                        this.usersInfo.push(this.formatItem(item, response2.data, this.index++));

                                })
                            }

                            if (this.pages > 1)
                                this.retrieveTheRestOfTheData().then(() => {
                                    this.loading = false;
                                });
                            else
                                this.loading = false;
                        });
                }
            },
            async retrieveTheRestOfTheData() {
                for (let i = 2; i <= this.pages; i++) {
                    axios.get('https://api.github.com/search/users?' + this.formatQueryString(i), {
                        auth: {
                            username: process.env.VUE_APP_USERNAME,
                            password: process.env.VUE_APP_API_KEY
                        }
                    })
                        .then(response => {
                                for (let item of response.data.items) {
                                        axios.get('https://api.github.com/users/' + item.login, {
                                            auth: {
                                                username: process.env.VUE_APP_USERNAME,
                                                password: process.env.VUE_APP_API_KEY
                                            }
                                        }).then(res => {
                                            let data = res.data;
                                            if (this.hireable && data.hireable)
                                                this.usersInfo.push(this.formatItem(item, data, this.index++));
                                            else if (!this.hireable)
                                                this.usersInfo.push(this.formatItem(item, data, this.index++));
                                        });

                                }
                            }
                        );
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
            formatQueryString(page) {
                let index = null;
                if (this.query.match('&per_page=')) {
                    index = this.query.match('&per_page=').index;
                } else {
                    return '';
                }
                if (index != null) {
                    return this.query.slice(0, index) + '&per_page=' + this.queryPerPage + '&page=' + page;
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