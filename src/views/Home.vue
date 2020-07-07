<template lang="pug">

  .page.page-home

    header
      .layout
        h1
          logo(type)

    main
      .layout
        p.headline
          template(v-if="!isWeekend") Weekend starts&puncsp;
          template(v-if="isWeekend") It will be Monday&puncsp;
          time-string(
            :datetime="targetTime"
            :unit="'hour'"
          )
          | .

        p.tagline Quando counts the days.

        template(v-if="items.length")
          router-link.button._key(
            :to="{ name: 'List' }"
          ) Go to your times

        template(v-else)
          router-link.button._key(
            :to="{ name: 'New' }"
          ) Count your own time


</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Logo from '@/components/Logo.vue'
import TimeString from '@/components/TimeString.vue'

@Component({
  components: { Logo, TimeString },
  computed: mapState(['items']),
})
export default class Home extends Vue {
  items!: any

  get date() {
    return new Date()
  }

  get isWeekend() {
    const day = this.date.getDay()
    const hour = this.date.getHours()

    if (day < 1 || (day > 4 && hour > 16)) {
      return true
    }

    return false
  }

  get targetTime() {
    const t = this.date

    if (!this.isWeekend) {
      const friday = t.getDate() + ((12 - t.getDay()) % 7)
      t.setDate(friday)
      t.setHours(17, 0, 0, 0)
    } else {
      const monday = t.getDate() + ((8 - t.getDay()) % 7)
      t.setDate(monday)
      t.setHours(0, 0, 0, 0)
    }

    return t.toISOString()
  }
}
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

  & .headline {
    font-size: clamp(2rem, 6vw, 5rem);
    line-height: (36/32);
    margin: 0 0 rem(12);
  }

  & .tagline {
    font-size: clamp(1.5rem, 4vw, 3rem);
    line-height: (28/24);
    margin: 0 0 em(40, 24);
  }
}
</style>
