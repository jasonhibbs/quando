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

          .form-block._submit
            //- .form-block-hint
              p ID is {{itemId}}
              p Label is {{ modelLabel }}
              p Date is {{ modelDatetime }}
            .form-block-controls
              button(
                type="submit"
                :disabled="!isModelValid"
              ) Save Changes

        .zone-danger
          h2 Danger Zone
          button(
            type="button"
            @click="onClickButtonDelete"
          ) ✗ Delete Time

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

  get isModelValid() {
    return this.modelLabel && this.modelDatetime
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
