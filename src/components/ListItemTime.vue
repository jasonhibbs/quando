<template lang="pug">

  router-link.times-item(
    :to="{ name: 'Single', params: { id: id }}"
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
    id: string
    label: string
    datetime: string
  }

  get id() {
    return this.time.id
  }

  get timeLabel() {
    return this.time.label
  }

  get timeString() {
    const then = new Date(this.time.datetime)
    const now = new Date()
    return formatDistanceStrict(then, now, { addSuffix: true })
  }
}
</script>
