<template lang="pug">

  .page.page-home

    header
      .layout
        h1
          logo(type)

    main
      .layout
        p Quando lets you count the days.

        router-link.button(
          :to="{ name: 'List' }"
        ) List


</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Logo from '@/components/Logo.vue'

@Component({
  components: { Logo },
})
export default class Home extends Vue {}
</script>

<style lang="scss">
@import '../assets/scss/util';

.page-home {
  header {
    padding: rem(32) 0;
  }

  header h1 {
    margin: 0;
  }
}
</style>
