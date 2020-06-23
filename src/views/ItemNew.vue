<template lang="pug">

  .screen.item-new

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

          .form-block._inline

            form-block-input#input-date(
              type="date"
              placeholder="YYYY-MM-DD"
              min="0101-01-01"
              max="9999-12-31"
              required
              v-model="model.date"
            ) Date

            form-block-input#input-time(
              type="time"
              placeholder="HH:MM"
              required
              v-model="model.time"
            ) Time
              template(#after-control)
                .form-block-control.form-block-timezone
                  select-timezone(
                    :target="modelDatetime"
                    v-model="model.timezone"
                  )

          .form-block._inline

            form-block-input#input-label(
              type="text"
              required
              :placeholder="placeholder"
              v-model="model.label"
            ) Label

            form-block-select#input-display(
              :options="displayOptions"
              v-model="model.display"
            ) Units

          .form-block._section
            h2 Preview
            list-item-time(
              :time="preview"
            )

          .form-block._submit
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
import { lightFormat, formatDistanceStrict } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import FormBlockInput from '@/components/FormBlockInput.vue'
import FormBlockSelect from '@/components/FormBlockSelect.vue'
import SelectTimezone from '@/components/SelectTimezone.vue'
import ListItemTime from '@/components/ListItemTime.vue'

@Component({
  components: {
    FormBlockInput,
    FormBlockSelect,
    SelectTimezone,
    ListItemTime,
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
    display: 'auto',
  }

  displayOptions = [
    { label: 'Auto', value: 'auto' },
    { label: 'Seconds', value: 'second' },
    { label: 'Minutes', value: 'minute' },
    { label: 'Days', value: 'day' },
    { label: 'Month', value: 'month' },
  ]

  // Setup

  get placeholder() {
    return this.isPastDate ? 'It happened' : 'It happens'
  }

  get item() {
    return {
      id: this.model.id,
      label: this.model.label,
      datetime: this.modelDatetime,
      timezone: this.modelTimezone,
      display: this.model.display || 'auto',
    }
  }

  get preview() {
    const { datetime, timezone, display } = this.item
    return {
      label: this.model.label || this.placeholder,
      datetime,
      timezone,
      display,
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

  get dateDatetime() {
    return new Date(this.modelDatetime)
  }

  get isPastDate() {
    return +this.dateDatetime < +new Date()
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
