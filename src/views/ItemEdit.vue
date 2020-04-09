<template lang="pug">

  main
    form(@submit.prevent='onSubmit')
      .layout

        .form-block
          label(for="input-label") Label
          input(
            id="input-label"
            required
            :placeholder="item.label"
            v-model="modelLabel"
          )

        .form-block
          label(for="input-date") Date
          input(
            id="input-date"
            type="date"
            required
            :placeholder="item.datetime"
            v-model="modelDate"
          )

        .form-block
          p ID is {{itemId}}
          p Label is {{ modelLabel }}
          p Date is {{ modelDate }}
          button(
            type="submit"
            :disabled="!isModelValid"
          ) Update Item


</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ItemNew extends Vue {
  modelLabel: string = ''
  modelDate: string = ''

  get isModelValid() {
    return this.modelLabel && this.modelDate
  }

  get itemId() {
    return this.$route.params.id
  }

  get item() {
    return this.$store.getters.getItemById(this.itemId)
  }

  get updatedItem() {
    return {
      id: this.itemId,
      label: this.modelLabel,
      datetime: `${this.modelDate}T00:00:00Z`,
    }
  }

  mounted() {
    if (!this.item) {
      this.$router.push({ name: 'Single', params: { id: this.itemId } })
    }

    this.modelLabel = this.item.label
    this.modelDate = this.item.datetime.slice(0, 10)
  }

  onSubmit() {
    if (this.isModelValid) {
      this.$store.commit('updateItem', this.updatedItem)
      this.$router.push({ name: 'Single', params: { id: this.itemId } })
    }
  }
}
</script>
