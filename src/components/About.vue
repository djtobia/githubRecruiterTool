<template>
    <v-content>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>About this App</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="6" md="6" sm="6">
                                This application was created by Dylan Tobia, using Vue.js with Vuetify. <br>
                                It uses the publicly available github search api. <br>
                                His <a href="http://github.com/djtobia" target="_blank">github</a> <br>
                                His <a href="http://dylantobia.com" target="_blank">website</a> <br>
                                His <a href="mailto:djtobia@gmail.com">email</a> <br>
                            </v-col>
                            <v-col cols="6">
                                His sweet, sweet face. <br>
                                <img src="@/assets/Me.jpg" alt="Me" class="medium-image">
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-content>
</template>

<script>

</script>

<style scoped lang="less">
 .medium-image {
     height: 500px;
     width: 250px;
 }
</style>