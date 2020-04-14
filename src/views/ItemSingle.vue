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
      template(v-if="item")
        .layout
          p
            time(:datetime="item.datetime") {{ dateString }}

          p {{ sentence }}

        counter(
          type="seconds"
          :milliseconds="milliseconds"
        )
        counter(
          type="minutes"
          :milliseconds="milliseconds"
        )
        counter(
          type="hours"
          :milliseconds="milliseconds"
        )
        counter(
          type="days"
          :milliseconds="milliseconds"
        )
        counter(
          type="weeks"
          :milliseconds="milliseconds"
        )
        counter(
          type="months"
          :milliseconds="milliseconds"
        )
        counter(
          type="years"
          :milliseconds="milliseconds"
        )

      template(v-else)
        .layout
          p That doesn’t exist
          p
            router-link(:to="{ name: 'List' }") Go to the list


</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { formatDistanceStrict } from 'date-fns'
import Counter from '@/components/Counter.vue'

@Component({
  components: {
    Counter,
  },
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

  get dateString() {
    const options = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }

    const date = new Date(this.item.datetime).toLocaleString(
      navigator.language,
      options
    )

    return date
  }

  get now() {
    const t = this.tick // force update
    return new Date().getTime()
  }

  get then() {
    return new Date(this.item.datetime).getTime()
  }

  get milliseconds() {
    const d = this.then - this.now
    return d
  }

  get sentence() {
    const strings: string[] = []
    let s = Math.abs(this.milliseconds) / 1000

    let years = Math.floor(s / 31557600)
    s -= years * 31557600
    if (years) {
      strings.push(`${years} year${years === 1 ? '' : 's'}`)
    }

    let months = Math.floor(s / 2629800)
    s -= months * 2629800
    if (months) {
      strings.push(`${months} month${months === 1 ? '' : 's'}`)
    }

    let days = Math.floor(s / 86400)
    s -= days * 86400
    if (days) {
      strings.push(`${days} day${days === 1 ? '' : 's'}`)
    }

    let hours = Math.floor(s / 3600)
    s -= hours * 3600
    if (hours) {
      strings.push(`${hours} hour${hours === 1 ? '' : 's'}`)
    }

    let minutes = Math.floor(s / 60)
    s -= minutes * 60
    if (minutes) {
      strings.push(`${minutes} minute${minutes === 1 ? '' : 's'}`)
    }

    let seconds = Math.floor(s)
    if (seconds) {
      strings.push(`${seconds} second${seconds === 1 ? '' : 's'}`)
    }

    if (this.milliseconds < 0) {
      const lastIndex = strings.length - 1
      const suffixString = `${strings[lastIndex]} ago`
      strings.splice(lastIndex, 1, suffixString)
    }

    return strings.join(', ')
  }
}
</script>
