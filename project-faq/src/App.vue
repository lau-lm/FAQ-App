<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import { Store } from '@/Store.js'
  import Hello from '@/components/Hello'
  import Navbar from '@/components/Navbar'

  export default {
    name: 'app',
    components: { navbar: Navbar }
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>