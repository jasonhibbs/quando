<template lang="pug">

  main
    .layout
      p
        router-link(
          :to="{ name: 'New' }"
        ) + Add New

      h1 Times

      .times
        router-link.times-item(
          v-for="time in times"
          :key="time.id"
          :to="{ name: 'Single', params: { id: time.id }}"
        )
          .times-item-label {{ time.label }}
          .times-item-time {{ time.datetime | fromNow }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { formatDistanceStrict } from 'date-fns'

@Component({
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

  get times() {
    return this.items
  }
}
</script>

