<template lang="pug">

  .screen(v-if="item")

    .bar
      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'Single', params: { id: this.itemId } }"
        ) ← Back

      .bar-block
        h1 Edit Time

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
              p ID is {{itemId}}
              p Label is {{ modelLabel }}
              p Date is {{ modelDatetime }}
            .form-block-controls
              button(
                type="submit"
                :disabled="!isModelValid || !isModelDifferent"
              )
                .button-label Save Changes

        .zone-danger
          h2 Danger Zone
          button._bad(
            type="button"
            @click="onClickButtonDelete"
          )
            .button-label ✗ Delete Time

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FormBlockInput from '@/components/FormBlockInput.vue'

@Component({
  components: { FormBlockInput },
})
export default class ItemNew extends Vue {
  modelLabel: string = ''
  modelDate: string = ''
  modelTime: string = ''

  mounted() {
    if (!this.item) {
      this.$router.push({ name: 'Single', params: { id: this.itemId } })
      return
    }
    this.setupModel()
  }

  get placeholder() {
    return 'It happened'
  }

  setupModel() {
    this.modelLabel = this.item.label
    this.modelDate = this.item.datetime.slice(0, 10)
    this.modelTime = this.item.datetime.slice(11, 16)
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
      datetime: this.modelDatetime,
    }
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

  get isModelDifferent() {
    const labelChanged = this.item.label !== this.modelLabel
    const datetimeChanged = this.item.datetime !== this.modelDatetime
    return labelChanged || datetimeChanged
  }

  onSubmit() {
    if (this.isModelValid) {
      this.$store.commit('updateItem', this.updatedItem)
      this.$router.push({ name: 'Single', params: { id: this.itemId } })
    }
  }

  onClickButtonDelete() {
    if (confirm('You will never see this time again')) {
      this.$store.commit('removeItemById', this.itemId)
      this.$router.push({ name: 'List' })
    }
  }
}
</script>
