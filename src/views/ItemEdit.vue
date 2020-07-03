<template lang="pug">

  .screen(v-if="item")

    header.bar
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
                .form-block-control._min
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

            form-block-select#input-display._min(
              :options="displayOptions"
              v-model="model.display"
            ) Units

          .form-block
            h2 Preview
            list-item-time(
              :time="preview"
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
    label: '',
    date: '',
    time: '',
    timezone: '',
    display: '',
  }

  displayOptions = [
    { label: 'Auto', value: 'auto' },
    { label: 'Seconds', value: 'second' },
    { label: 'Minutes', value: 'minute' },
    { label: 'Hours', value: 'hour' },
    { label: 'Days', value: 'day' },
    { label: 'Months', value: 'month' },
    { label: 'Years', value: 'year' },
  ]

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
    this.model.label = this.item.label
    this.model.timezone = this.item.timezone || this.user.timezone
    this.model.display = this.item.display || 'auto'

    const zonedTime = utcToZonedTime(this.item.datetime, this.model.timezone)
    this.model.date = lightFormat(zonedTime, 'yyyy-MM-dd')
    this.model.time = lightFormat(zonedTime, 'HH:mm:ss')
  }

  get placeholder() {
    return this.isPastDate ? 'It happened' : 'It happens'
  }

  get itemId() {
    return this.$route.params.id
  }

  get item() {
    return this.$store.getters.getItemById(this.itemId)
  }

  get preview() {
    return {
      label: this.model.label || this.placeholder,
      datetime: this.modelDatetime,
      timezone: this.model.timezone,
      display: this.model.display || 'auto',
    }
  }

  get modelDatetime() {
    if (!this.isDateValid) return ''
    return zonedTimeToUtc(
      `${this.model.date} ${this.model.time}`,
      this.model.timezone
    ).toISOString()
  }

  get updatedItem() {
    return {
      id: this.itemId,
      label: this.model.label,
      datetime: this.modelDatetime,
      timezone: this.model.timezone,
      display: this.model.display,
    }
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

  get isModelDifferent() {
    const labelChanged = this.item.label !== this.model.label
    const datetimeChanged = this.item.datetime !== this.modelDatetime
    const timezoneChanged = this.item.timezone !== this.model.timezone
    const displayChanged = this.item.display !== this.model.display
    return labelChanged || datetimeChanged || timezoneChanged || displayChanged
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
