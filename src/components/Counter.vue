<template lang="pug">

  .counter(v-if="count > 0")
    .counter-inner
      .counter-count {{ count | thousands }}
      span.counter-unit {{ unit }} #[span(v-if="!future") ago]

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  filters: {
    thousands: (n: number) => {
      return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
  },
})
export default class Counter extends Vue {
  @Prop() milliseconds!: number
  @Prop({ default: 'seconds' }) type!: string

  future: boolean = false

  mounted() {
    this.future = this.milliseconds > 0
  }

  get seconds() {
    return Math.floor(Math.abs(this.milliseconds) / 1000)
  }

  get count() {
    switch (this.type) {
      case 'seconds':
        return this.seconds
      case 'minutes':
        return Math.floor(this.seconds / 60)
      case 'hours':
        return Math.floor(this.seconds / 3600)
      case 'days':
        return Math.floor(this.seconds / 86400)
      case 'weeks':
        return Math.floor(this.seconds / 604800)
      case 'months':
        return Math.floor(this.seconds / 2629800)
      case 'years':
        return Math.floor(this.seconds / 31557600)
    }
  }

  get unit() {
    return this.count === 1
      ? this.type.substr(0, this.type.length - 1)
      : this.type
  }
}
</script>
