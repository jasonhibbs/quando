<template lang="pug">

  main
    form(@submit.prevent='onSubmit')
      .layout

        .form-block
          label(for="input-label") Label
          input(
            id="input-label"
            placeholder="I was born"
            required
            v-model="modelLabel"
          )

        .form-block
          label(for="input-date") Date
          input(
            id="input-date"
            type="date"
            required
            v-model="modelDate"
          )

        .form-block
          p ID is {{modelId}}
          p Label is {{ modelLabel }}
          p Date is {{ modelDate }}
          button(
            type="submit"
            :disabled="!isModelValid"
          ) Add Item


</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Hashids from 'hashids'
import { v4 as uuidv4 } from 'uuid'

@Component
export default class ItemNew extends Vue {
  modelId: string = uuidv4()
  modelLabel: string = ''
  modelDate: string = ''

  get isModelValid() {
    return this.modelLabel && this.modelDate
  }

  get item() {
    return {
      id: this.modelId,
      label: this.modelLabel,
      datetime: `${this.modelDate}T00:00:00Z`,
    }
  }

  onSubmit() {
    if (this.isModelValid) {
      this.$store.commit('addItem', this.item)
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
