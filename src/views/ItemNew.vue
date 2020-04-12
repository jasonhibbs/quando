<template lang="pug">

  .screen

    .bar
      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'List' }"
        ) ← Back
      .bar-block
        h1 New Title

    main
      .layout

        form(@submit.prevent='onSubmit')

          form-block-input#input-label(
            type="text"
            placeholder="I was born"
            required
            v-model="modelLabel"
          ) Label

          form-block-input#input-date(
            type="date"
            placeholder="YYYY-MM-DD"
            required
            v-model="modelDate"
          ) Date

          form-block-input#input-time(
            type="time"
            placeholder="HH:MM"
            required
            v-model="modelTime"
          ) Time

          .form-block
            .form-block-hint
              p ID is {{modelId}}
              p Label is {{ modelLabel }}
              p Date is {{ modelDatetime }}
            .form-block-controls
              button(
                type="submit"
                :disabled="!isModelValid"
              ) Add Item


</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Hashids from 'hashids'
import { v4 as uuidv4 } from 'uuid'
import FormBlockInput from '@/components/FormBlockInput.vue'

@Component({
  components: { FormBlockInput },
})
export default class ItemNew extends Vue {
  modelId: string = uuidv4()
  modelLabel: string = ''
  modelDate: string = new Date().toISOString().slice(0, 10)
  modelTime: string = '00:00'

  get modelDatetime() {
    return this.modelDate
      ? `${this.modelDate}T${this.modelTime || '00:00'}:00Z`
      : ''
  }

  get isModelValid() {
    return this.modelLabel && this.modelDatetime
  }

  get item() {
    return {
      id: this.modelId,
      label: this.modelLabel,
      datetime: this.modelDatetime,
    }
  }

  onSubmit() {
    if (this.isModelValid) {
      this.$store.commit('addItem', this.item)
      this.$router.push({ name: 'Single', params: { id: this.modelId } })
    }
  }
}
</script>
