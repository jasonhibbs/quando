<template lang="pug">

  time.time-string(
    :datetime="datetime"
    :data-unit="unit"
  ) {{ text }}

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatDistanceStrict } from 'date-fns'

@Component
export default class NewComponent extends Vue {
  @Prop() datetime?: string
  @Prop({ default: 'auto' }) unit?:
    | 'auto'
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'month'
    | 'year'

  // Lifecycle

  tick: number = 0
  tickInterval: any = null

  mounted() {
    if (this.unit === 'second') {
      this.tickInterval = setInterval(() => {
        this.tick++
      }, 1000)
    }

    if (this.unit === 'minute') {
      const now = new Date()
      const offset = now.getSeconds() * 1000 + now.getMilliseconds()
      setTimeout(() => {
        this.tick++
        this.tickInterval = setInterval(() => {
          this.tick++
        }, 1000 * 60)
      }, 60000 - offset)
    }
  }

  beforeDestroy() {
    clearInterval(this.tickInterval)
  }

  // String

  get dateUnit() {
    return this.unit && this.unit !== 'auto' ? this.unit : undefined
  }

  parseThousands(s: string) {
    return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  get text() {
    if (!this.datetime) {
      return 'Anon'
    }
    const t = this.tick // force update
    const then = new Date(this.datetime)
    const now = new Date()
    const isInPast = +then < +now
    const options: any = {
      addSuffix: true,
      unit: this.dateUnit,
      roundingMethod: this.dateUnit || isInPast ? 'floor' : 'round',
    }
    const s = formatDistanceStrict(then, now, options)
    return this.parseThousands(s)
  }
}
</script>

<style lang="scss">
.time-string[data-unit='second'] {
  font-variant: tabular-nums;
}
</style>
