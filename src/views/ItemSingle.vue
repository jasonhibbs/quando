<template lang="pug">

  .screen

    header.bar
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

        .list-item.date-item
          .list-item-inner
            time(:datetime="item.datetime") {{ dateString }}

        .list-item.sentence-item
          .list-item-inner
            p(v-html="sentence")

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
      timeZone: this.item.timezone,
      dateStyle: 'full',
      timeStyle: 'full',
    }

    const date = new Date(this.item.datetime).toLocaleString(
      navigator.language,
      options
    )

    return date.replace(':00 ', ' ')
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
    let seconds = Math.abs(this.milliseconds) / 1000
    const strings: string[] = []
    const units = [
      { label: 'years', divisor: 31557600 },
      { label: 'months', divisor: 2629800 },
      { label: 'days', divisor: 86400 },
      { label: 'hours', divisor: 3600 },
      { label: 'minutes', divisor: 60 },
      { label: 'seconds', divisor: 0 },
    ]

    units.forEach(unit => {
      const total = Math.floor(seconds / (unit.divisor || 1))
      seconds -= total * unit.divisor
      if (total) {
        const unitLabel =
          total === 1 ? unit.label.substr(0, unit.label.length - 1) : unit.label
        strings.push(`<span class="tabular">${total}</span> ${unitLabel}`)
      }
    })

    if (this.milliseconds < 0) {
      const lastIndex = strings.length - 1
      const suffixString = `${strings[lastIndex]} ago`
      strings.splice(lastIndex, 1, suffixString)
    }

    return strings.join(', ')
  }
}
</script>
