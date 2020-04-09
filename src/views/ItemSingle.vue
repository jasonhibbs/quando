<template lang="pug">

  main
    .layout

      p
        router-link(:to="{ name: 'List' }") ← The List

      template(v-if="item")
        .times-item
          .times-item-label {{ item.label }}
          time.times-item-time(:datetime="item.datetime") {{ item.datetime | fromNow }}

        p
          router-link(:to="{ name: 'Edit', params: { id: item.id } }") Edit
        p
          button(@click="onClickButtonDelete") Delete

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

  onClickButtonDelete() {
    this.$store.commit('removeItemById', this.itemId)
    this.$router.push({ name: 'List' })
  }
}
</script>
