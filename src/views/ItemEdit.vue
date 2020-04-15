<template lang="pug">

  .screen(v-if="item")

    .bar
      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'Single', params: { id: this.itemId } }"
        ) Cancel

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

          .form-block._inline

            form-block-input#input-time(
              type="time"
              placeholder="HH:MM"
              required
              v-model="modelTime"
            ) Time

            form-block-select#select-timezone(
              v-model="timezoneSelected"
            )
              template(#default) Time
              template(#options)
                optgroup(label="Local")
                  option(value="") {{ user.timezone }}
                optgroup(
                  v-for="group in timezoneOptions"
                  :label="group.label"
                )
                  option(
                    v-for="zone in group.zones"
                    :value="zone.value"
                  ) {{ zone.label }}

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
import { mapState } from 'vuex'
import { lightFormat } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { TIMEZONES } from '@/timezones.ts'
import FormBlockInput from '@/components/FormBlockInput.vue'
import FormBlockSelect from '@/components/FormBlockSelect.vue'

@Component({
  components: {
    FormBlockInput,
    FormBlockSelect,
  },
  computed: mapState(['user']),
})
export default class ItemNew extends Vue {
  user!: any
  modelLabel: string = ''
  modelDate: string = ''
  modelTime: string = ''
  timezoneSelected = ''
  timezoneOptions = TIMEZONES

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
    console.log(this.item.timezone)
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
