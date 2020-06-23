<template lang="pug">

  component.times-item(
    :is="tag"
    :to="href"
  )
    .times-item-inner
      .times-item-label {{ timeLabel }}
      .times-item-time {{ timeString }}

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatDistanceStrict } from 'date-fns'

@Component
export default class ListItemTime extends Vue {
  @Prop() time!: {
    id?: string
    label: string
    datetime: string
    display?: string
  }

  tick: number = 0
  tickInterval: any = null

  mounted() {
    if (this.displayUnits === 'second') {
      this.tickInterval = setInterval(() => {
        this.tick++
      }, 1000)
    }

    if (this.displayUnits === 'minute') {
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

  get id() {
    return this.time.id
  }

  get href() {
    return !this.id ? null : { name: 'Single', params: { id: this.id } }
  }

  get tag() {
    return this.href ? 'router-link' : 'div'
  }

  get timeLabel() {
    return this.time.label
  }

  get displayUnits() {
    return this.time.display && this.time.display !== 'auto'
      ? this.time.display
      : undefined
  }

  get timeString() {
    const t = this.tick // force update
    const then = new Date(this.time.datetime)
    const now = new Date()
    const options: any = {
      addSuffix: true,
      unit: this.displayUnits,
      roundingMethod: 'floor',
    }
    const string = formatDistanceStrict(then, now, options)
    return this.parseThousands(string)
  }

  parseThousands(string: string) {
    return string.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
}
</script>
<style lang="scss">
@import '../assets/scss/util';

.times-item {
  display: block;
  box-shadow: 0 1px 0 var(--contrast-lightest);
}

.times-item-inner {
  width: var(--layout-base);
  max-width: var(--layout-measure);
  margin: 0 auto;
  padding: rem(16) 0;
  padding-right: env(safe-area-inset-right);
  padding-left: env(safe-area-inset-left);
}

a.times-item {
  &,
  &:focus,
  &:hover {
    color: var(--color-text);
  }

  &:hover {
    background-color: var(--contrast-lightest);
  }

  &:focus {
    outline-offset: -3px;
  }
}

div.times-item {
  background-color: var(--color-root);
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--contrast-lightest),
    0 1px 1rem var(--contrast-lighter);
}

div > .times-item-inner {
  padding: rem(16) rem(18);
}

.times-item-label {
  font-size: clamp(1rem, 5vw, em(32));
}
.times-item-time {
  font-size: clamp(1.5rem, 8vw, em(48));
}
</style>
