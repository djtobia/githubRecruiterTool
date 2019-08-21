<template>
    <v-app>
        <v-content>
            <v-banner :dark="true">
                <span>Welcome to the Github Recruiter Tool!</span>
                <template v-slot:actions>
                        <v-btn color="orange" :to="route.link" @click="checkRoute">{{ route.text }}</v-btn>

                </template>
            </v-banner>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>

    export default {
        name: 'App',
        data() {
            return {
                route: {
                    link: '/about',
                    text: 'About'
                }
            }
        },
        methods: {
            checkRoute() {
                if(this.route.link === '/about'){
                    this.route.link = '/';
                    this.route.text = 'Home'
                } else {
                    this.route.link = '/about';
                    this.route.text = 'About';
                }
            }
        }
    };
</script>
