<template lang="pug">

  .screen

    .bar
      .bar-block
        router-link.bar-button._start(
          :to="{ name: 'List' }"
        ) Cancel
      .bar-block
        h1 New Time

    main
      .layout
        form.form-blocks(@submit.prevent='onSubmit')

          form-block-input#input-label(
            type="text"
            required
            :placeholder="placeholder"
            v-model="model.label"
          ) Label


          form-block-input#input-date(
            type="date"
            placeholder="YYYY-MM-DD"
            min="0101-01-01"
            max="9999-12-31"
            required
            v-model="model.date"
          ) Date

          .form-block._inline

            form-block-input#input-time(
              type="time"
              placeholder="HH:MM"
              required
              v-model="model.time"
            ) Time

            form-block-select#select-timezone(
              v-model="model.timezone"
            )
              template(#default) Timezone
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
              p ID is {{modelId}}
              p Label is {{ model.label }}
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
import { v4 as uuidv4 } from 'uuid'
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

  model = {
    id: uuidv4(),
    label: '',
    date: new Date().toISOString().slice(0, 10),
    time: '00:00',
    timezone: '',
  }

  timezoneSelected = ''
  timezoneOptions = TIMEZONES

  // Setup

  get placeholder() {
    return 'It happened'
  }

  get item() {
    return {
      id: this.model.id,
      label: this.model.label,
      datetime: this.modelDatetime,
      timezone: this.modelTimezone,
    }
  }

  get modelTimezone() {
    return this.model.timezone || this.user.timezone
  }

  get modelDatetime() {
    if (!this.isDateValid) return ''
    return zonedTimeToUtc(
      `${this.model.date} ${this.model.time}`,
      this.modelTimezone
    ).toISOString()
  }

  // Validation

  get isDateValid() {
    return !isNaN(Date.parse(this.model.date))
  }

  get isDatetimeValid() {
    return !isNaN(Date.parse(this.modelDatetime))
  }

  get isModelValid() {
    return this.model.label && this.modelDatetime && this.isDatetimeValid
  }

  // Events

  onSubmit() {
    if (this.isModelValid) {
      this.$store.commit('addItem', this.item)
      this.$router.push({ name: 'Single', params: { id: this.model.id } })
    }
  }
}
</script>
