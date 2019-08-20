<template>
    <v-app>
        <div class="row">
            <div class="col-md-12">

                <v-data-table :headers="tableHeaders"
                              :items="usersInfoMain"
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
                    <template slot="item.name" slot-scope="props">
                       <span v-if="usersInfoSecondary[props.item.id]">{{ usersInfoSecondary[props.item.id].fullname }}</span>
                    </template>
                    <template slot="item.email" slot-scope="props">
                       <span v-if="usersInfoSecondary[props.item.id]"> {{ usersInfoSecondary[props.item.id].email }} </span>
                    </template>
                    <template slot="item.company" slot-scope="props">
                        <span v-if="usersInfoSecondary[props.item.id]"> {{ usersInfoSecondary[props.item.id].company }}</span>
                    </template>
                    <template slot="item.location" slot-scope="props">
                        <span v-if="usersInfoSecondary[props.item.id]">{{ usersInfoSecondary[props.item.id].location }}</span>
                    </template>
                    <template slot="item.hireable" slot-scope="props">
                        <span v-if="usersInfoSecondary[props.item.id]">
                            <v-chip :color="getColor(usersInfoSecondary[props.item.id].hireable)" dark>{{usersInfoSecondary[props.item.id].hireable}}</v-chip>
                        </span>
                    </template>
                    <template slot="expanded-item" slot-scope="props">

                        <td :colspan="tableHeaders.length-2">Bio: <span v-if="usersInfoSecondary[props.item.id]">{{ usersInfoSecondary[props.item.id].bio }}</span></td>
                        <td :colspan="2">Website :
                            <span v-if="usersInfoSecondary[props.item.id] && usersInfoSecondary[props.item.id].website !== 'None Listed'"><a :href="usersInfoSecondary[props.item.id].website" target="_blank">{{usersInfoSecondary[props.item.id].website}}</a></span>
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
                usersInfoMain: [],
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
                this.usersInfoMain.splice(0, this.usersInfoMain.length);
                this.loading = true;
                if (this.query !== '') {
                    if (!this.query.match('&per_page=')) {
                        this.query = this.query + '&per_page=' + this.itemsPerPage;
                    }
                    axios.get('https://api.github.com/search/users?' + this.query,{
                        auth: {
                            username: 'djtobia',
                            password: process.env.APIKEY
                        }
                    })
                        .then(response => {
                            this.totalItems = response.data.total_count;
                            if (response.headers.link)
                                this.pages = response.headers.link.split(',')[1].match(/&page=\d*[^>]/g)[0].split('=')[1];
                            let index = 0;
                            for (let item of response.data.items) {
                                this.usersInfoMain.push(this.formatItem(item, index++));
                            }
                            this.loading = false;
                            this.getSecondaryInfo();
                        });
                }
            },
            getSecondaryInfo() {
                //for each login in usersInfoMain, get that user and store in secondary.
                this.usersInfoSecondary.splice(0, this.usersInfoSecondary.length);
                for (let user of this.usersInfoMain) {
                    axios.get('https://api.github.com/users/' + user.username, {
                        auth: {
                            username: 'djtobia',
                            password: process.env.APIKEY
                        }
                    }).then(response => {
                        this.usersInfoSecondary.push(this.formatSecondaryData(response.data));
                    })
                }
            },
            formatItem(item, index) {
                let newItem = {};
                newItem['id'] = index;
                newItem['avatar_url'] = item.avatar_url;
                newItem['username'] = item.login;
                newItem['url'] = item.html_url;
                return newItem;
            },
            formatSecondaryData(data) {
                let website = data.blog;
                if(website && website.search('http') === -1){
                    website = 'http://' + website;
                }
                let formattedData = {
                    bio: data.bio ? data.bio : 'None Listed',
                    website: website ? website : 'None Listed',
                    company: data.company ? data.company : 'None Listed',
                    email: data.email ? data.email : 'None Listed',
                    location: data.location ? data.location : 'None Listed',
                    fullname: data.name ? data.name : 'No Name Listed',
                    hireable: data.hireable ? 'Yes' : 'No'
                };
                return formattedData;
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