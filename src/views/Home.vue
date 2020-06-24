<template lang="pug">

  .screen

    header
      .layout
        h1 quando

    main
      .layout
        p Quando counts time

        router-link.button(
          :to="{ name: 'List' }"
        ) List


</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component
export default class Home extends Vue {}
</script>

