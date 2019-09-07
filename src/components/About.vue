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
                                Think this tool is useful, or just wanna help a dude out? Feel free to donate! <br>
                                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                                    <input type="hidden" name="cmd" value="_donations"/>
                                    <input type="hidden" name="business" value="YU3SV5KFQ7J9C"/>
                                    <input type="hidden" name="currency_code" value="USD"/>
                                    <input type="image"
                                           src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                                           border="0" name="submit"
                                           title="PayPal - The safer, easier way to pay online!"
                                           alt="Donate with PayPal button"/>
                                    <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1"
                                         height="1"/>
                                </form>
                            </v-col>
                            <v-col cols="12" md="6" justify="center" align="center">
                                His sweet, sweet face. <br>
                                <div class="image-wrapper">
                                    <img src="@/assets/Me.jpg" alt="Me" class="medium-image">
                                </div>
                            </v-col>
                        </v-row>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
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
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: auto;
    }

    .image-wrapper {
        position: relative;
        padding-top: 56.25%;
    }
</style>