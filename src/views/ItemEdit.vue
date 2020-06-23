<template lang="pug">

  .screen(v-if="item")

    .bar
      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'Single', params: { id: this.itemId } }"
        ) Cancel

        button.bar-button._end._bad(
          @click="onClickButtonDelete"
        ) Delete

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

          .form-block._inline

            form-block-input#input-date(
              type="date"
              placeholder="YYYY-MM-DD"
              min="0101-01-01"
              max="9999-12-31"
              required
              v-model="modelDate"
            ) Date

            form-block-input#input-time(
              type="time"
              placeholder="HH:MM"
              required
              v-model="modelTime"
            ) Time
              template(#after-control)
                .form-block-control.form-block-timezone
                  select-timezone(
                    :target="modelDatetime"
                    v-model="timezoneSelected"
                  )

          .form-block._submit
            .form-block-controls
              router-link.button(
                :to="{ name: 'Single', params: { id: this.itemId } }"
              ) Cancel

              button(
                type="submit"
                :disabled="!isModelValid || !isModelDifferent"
              )
                .button-label Save Changes

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { lightFormat } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import FormBlockInput from '@/components/FormBlockInput.vue'
import FormBlockSelect from '@/components/FormBlockSelect.vue'
import SelectTimezone from '@/components/SelectTimezone.vue'

@Component({
  components: {
    FormBlockInput,
    FormBlockSelect,
    SelectTimezone,
  },
  computed: mapState(['user']),
})
export default class ItemNew extends Vue {
  user!: any
  modelLabel: string = ''
  modelDate: string = ''
  modelTime: string = ''
  timezoneSelected = ''

  // Lifecycle

  mounted() {
    if (!this.item) {
      this.$router.push({ name: 'Single', params: { id: this.itemId } })
      return
    }
    this.setupModel()
  }

  // Setup

  setupModel() {
    this.modelLabel = this.item.label
    this.timezoneSelected = this.item.timezone || ''
    const zonedTime = utcToZonedTime(this.item.datetime, this.modelTimezone)
    this.modelDate = lightFormat(zonedTime, 'yyyy-MM-dd')
    this.modelTime = lightFormat(zonedTime, 'HH:mm:ss')
  }

  get placeholder() {
    return 'It happened'
  }

  get itemId() {
    return this.$route.params.id
  }

  get item() {
    return this.$store.getters.getItemById(this.itemId)
  }

  get modelTimezone() {
    return this.timezoneSelected || this.user.timezone
  }

  get modelDatetime() {
    if (!this.isDateValid) return ''
    return zonedTimeToUtc(
      `${this.modelDate} ${this.modelTime}`,
      this.modelTimezone
    ).toISOString()
  }

  get updatedItem() {
    return {
      id: this.itemId,
      label: this.modelLabel,
      datetime: this.modelDatetime,
      timezone: this.modelTimezone,
    }
  }

  // Validation

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
    const timezoneChanged = this.item.timezone !== this.modelTimezone
    return labelChanged || datetimeChanged || timezoneChanged
  }

  // Events

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
