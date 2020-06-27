<template lang="pug">

  .screen.screen-list

    header.bar
      h1.visuallyhidden quando

      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'More' }"
        ) More
        logo
        router-link.bar-button._end(
          :to="{ name: 'New' }"
          title="Add Time"
        ) Add

    main

      .times
        template(v-if="times.length")
          list-item-time(
            v-for="time in times"
            :key="time.id"
            :time="time"
          )

        template(v-else)
          .list-copy
            h2 No times, yet.
            p Get started with #[button.link(@click="onClickDemo") some examples], or
            p
              router-link.button._key(:to="{ name: 'New' }") Add your own time


</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { formatDistanceStrict } from 'date-fns'
import Logo from '@/components/Logo.vue'
import ListItemTime from '@/components/ListItemTime.vue'

@Component({
  components: { Logo, ListItemTime },
  filters: {
    fromNow: (date: string) => {
      return formatDistanceStrict(new Date(date), new Date(), {
        addSuffix: true,
      })
    },
  },
  computed: mapState(['items']),
})
export default class ItemList extends Vue {
  items!: any

  sortByOldestLast: boolean = true

  sortTimes(a: any, b: any) {
    const aTime = new Date(a.datetime).getTime()
    const bTime = new Date(b.datetime).getTime()
    return this.sortByOldestLast ? bTime - aTime : aTime - bTime
  }

  get times() {
    return this.items.sort(this.sortTimes)
  }

  onClickDemo() {
    this.$store.commit('pushDemoItems')
  }
}
</script>
<style lang="scss">
.screen-list {
  .logo {
    font-size: (30em/16);
    padding: (7rem/16);
    flex: none;
  }
}
</style>
