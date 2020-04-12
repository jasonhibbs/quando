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

          p
            time(:datetime="item.datetime") {{ new Date(item.datetime).toLocaleString() }}
          p
            time(:datetime="item.datetime") {{ item.datetime | fromNow }}

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
    fromNow: (date: string) => {
      return formatDistanceStrict(new Date(date), new Date(), {
        addSuffix: true,
      })
    },
  },
})
export default class ItemSingle extends Vue {
  get itemId() {
    return this.$route.params.id
  }

  get item() {
    return this.$store.getters.getItemById(this.itemId)
  }
}
</script>
