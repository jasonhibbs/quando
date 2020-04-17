<template lang="pug">

  .screen

    .bar
      .bar-block
        router-link.bar-button._end(
          :to="{ name: 'New' }"
        ) Add

      .bar-block
        h1 quando

    main
      .layout

      .times
        template(v-if="times.length")
          list-item-time(
            v-for="time in times"
            :key="time.id"
            :time="time"
          )

        template(v-else)
          .list-copy
            p No times found

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { formatDistanceStrict } from 'date-fns'
import ListItemTime from '@/components/ListItemTime.vue'

@Component({
  components: { ListItemTime },
  filters: {
    fromNow: (date: string) => {
      return formatDistanceStrict(new Date(date), new Date(), {
        addSuffix: true,
      })
    },
  },
  computed: mapState(['items']),
})
export default class Home extends Vue {
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
}
</script>

