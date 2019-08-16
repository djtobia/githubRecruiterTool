<template>
  <div id="app">
    <v-app>
        <Base/>
    </v-app>
  </div>
</template>

<script>
    import Base from './components/Base.vue';

    export default {
        name: 'App',
        components: {
            Base,
        },
        data: () => ({
            //
        }),
    };
</script>
