<template>
    <v-content>
        <v-banner :dark="true">
            <span>Welcome to the Github Recruiter Tool!</span>
            <template v-slot:actions>
                <v-btn @click="hideCard = !hideCard" color="purple" v-text="hideCard ? 'Show Search' : 'Hide Search'"/>
            </template>
        </v-banner>
        <v-card max-width="500"
                class="mx-auto" v-if="!hideCard">
            <v-card-title>What kind of search would you like to do?</v-card-title>
            <v-card-text>
                <span>Disclaimer: Github will only allow a user to view the first 1000 records of a search. It's a bummer, but its life.</span>
                <v-form>
                    <v-row>
                        <v-col cols="6" md="6" sm="3">
                            <v-text-field label="Username (if you know it)" v-model="searchInputs.user"></v-text-field>
                        </v-col>
                        <v-col cols="6" md="6" sm="3">
                            <v-text-field label="Location" v-model="searchInputs.location"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="12" sm="3">
                            <v-text-field label="Full Name (if you know it)" v-model="searchInputs.fullname"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn class="green" :block="true" @click="search">Search!</v-btn>
            </v-card-actions>
            <v-snackbar v-model="toast">
                {{ errorText }}
                <v-btn color="red" @click="toast = false">X</v-btn>
            </v-snackbar>
        </v-card>
        <users v-if="query !== ''" :original-query-string="query"/>
    </v-content>
</template>

<script>
    import users from './Users.vue';

    export default {
        name: "Base",
        data() {
            return {
                searchInputs: {user: '', location: '', fullname: ''},
                errorText: 'You must put SOMETHING into a search field!',
                toast: false,
                query: '',
                hideCard: false
            };
        },
        components: {
            users
        },
        methods: {
            search() {
                this.searchResults = [];
                let query = 'q=';

                if (this.searchInputsAreEmpty()) {
                    this.toast = true;
                    return;
                }
                for (const input of Object.keys(this.searchInputs)) {
                    if (this.searchInputs[input] !== '')
                        query += input + ':"' + this.searchInputs[input] + '" ';
                }
                query = query.trim().replace(/\s/g, '+');
                this.query = query;
            },
            searchInputsAreEmpty() {
                let maxCount = Object.keys(this.searchInputs).length;
                let count = 0;
                for (let item of Object.keys(this.searchInputs)) {
                    if (this.searchInputs[item] === '')
                        count++;
                }
                return count === maxCount;
            },
        }
    }
</script>

<style scoped>

</style>