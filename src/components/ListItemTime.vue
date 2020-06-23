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
    const then = new Date(this.time.datetime)
    const now = new Date()
    const options: any = {
      addSuffix: true,
      unit: this.displayUnits,
    }
    const string = formatDistanceStrict(then, now, options)
    return this.parseThousands(string)
  }

  parseThousands(string: string) {
    return string.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
}
</script>
