<template lang="pug">

  .screen

    .bar
      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'List' }"
        ) ← Back
      .bar-block
        h1 New Time

    main
      .layout
        form.form-blocks(@submit.prevent='onSubmit')

          form-block-input#input-label(
            type="text"
            required
            :placeholder="placeholder"
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

          .form-block._submit
            //- .form-block-hint
              p ID is {{modelId}}
              p Label is {{ modelLabel }}
              p Date is {{ modelDatetime }}
            .form-block-controls
              button(
                type="submit"
                :disabled="!isModelValid"
              )
                .button-label Add Time


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

  get placeholder() {
    return 'It happened'
  }

  get modelDatetime() {
    return this.modelDate
      ? `${this.modelDate}T${this.modelTime || '00:00'}:00Z`
      : ''
  }

  get isDateValid() {
    return !isNaN(Date.parse(this.modelDate))
  }

  get isDatetimeValid() {
    return !isNaN(Date.parse(this.modelDatetime))
  }

  get isModelValid() {
    return this.modelLabel && this.modelDatetime && this.isDatetimeValid
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
