<template lang="pug">

  .screen

    .bar
      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'List' }"
        ) ← Back
        router-link.bar-button._end(
          :to="{ name: 'Edit' }"
        ) Edit
      .bar-block
        h1 {{ item.label }}

    main
      .layout

        template(v-if="item")

          p on&puncsp;
            time(:datetime="item.datetime") {{ new Date(item.datetime).toLocaleString() }}

          p(v-if="totalSeconds") {{ totalSeconds | thousands }} seconds  {{ future ? '' : 'ago' }}
          p(v-if="totalMinutes") {{ totalMinutes | thousands }} minutes  {{ future ? '' : 'ago' }}
          p(v-if="totalHours") {{ totalHours | thousands }} hours  {{ future ? '' : 'ago' }}
          p(v-if="totalDays") {{ totalDays | thousands }} days  {{ future ? '' : 'ago' }}
          p(v-if="totalWeeks") {{ totalWeeks | thousands }} weeks  {{ future ? '' : 'ago' }}
          p(v-if="totalMonths") {{ totalMonths | thousands }} months  {{ future ? '' : 'ago' }}
          p(v-if="totalYears") {{ totalYears | thousands }} years  {{ future ? '' : 'ago' }}

        template(v-else)
          p That doesn’t exist
          p
            router-link(:to="{ name: 'List' }") Go to the list


</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { formatDistanceStrict } from 'date-fns'

@Component({
  filters: {
    thousands: (n: number) => {
      return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
    fromNow: (date: string) => {
      return formatDistanceStrict(new Date(date), new Date(), {
        addSuffix: true,
      })
    },
  },
})
export default class ItemSingle extends Vue {
  tick: number = 0
  tickInterval: any = null
  future: boolean = false

  get itemId() {
    return this.$route.params.id
  }

  get item() {
    return this.$store.getters.getItemById(this.itemId)
  }

  mounted() {
    this.tickInterval = setInterval(() => {
      this.tick++
    }, 1000)
  }

  beforeDestroy() {
    clearInterval(this.tickInterval)
  }

  get now() {
    const t = this.tick // force update
    return new Date().getTime()
  }

  get then() {
    return new Date(this.item.datetime).getTime()
  }

  get delta() {
    const d = this.then - this.now
    if (d > 0) {
      this.future = true
    }
    return d
  }

  get totalSeconds() {
    return Math.floor(Math.abs(this.delta) / 1000)
  }

  get totalMinutes() {
    return Math.floor(this.totalSeconds / 60)
  }

  get totalHours() {
    return Math.floor(this.totalSeconds / 3600)
  }

  get totalDays() {
    return Math.floor(this.totalSeconds / 86400)
  }

  get totalWeeks() {
    return Math.floor(this.totalSeconds / 604800)
  }

  get totalMonths() {
    return Math.floor(this.totalSeconds / 2629800)
  }

  get totalYears() {
    return Math.floor(this.totalSeconds / 31557600)
  }
}
</script>
