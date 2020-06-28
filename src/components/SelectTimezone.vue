<template lang="pug">

  .select-timezone(
    aria-label="Timezone"
  )

    .select-timezone-display(role="presentation")
      span {{ abbr }}

    .select-timezone-control
      select(
        :value="value"
        @change="$emit('input', $event.target.value)"
      )
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

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import enGB from 'date-fns/locale/en-GB'
import { format, utcToZonedTime } from 'date-fns-tz'
import { TIMEZONES } from '@/timezones.ts'

@Component({
  computed: mapState(['user']),
})
export default class SelectTimezone extends Vue {
  @Prop() target?: string
  @Prop() value?: string

  user!: any

  get abbr() {
    const target = this.target ? new Date(this.target) : new Date()
    const timeZone = this.value || this.user.timezone
    const zonedTime = utcToZonedTime(target, timeZone)
    const zone = {
      timeZone,
      locale: enGB,
    }
    return format(zonedTime, 'zzz', zone)
  }

  get timezoneOptions() {
    return TIMEZONES
  }
}
</script>
<style lang="scss">
@import '../assets/scss/util';

.select-timezone {
  position: relative;
}

.select-timezone-display {
  background-color: var(--input-background-color);
  border: 1px solid transparent;
  border-radius: var(--controls-radius);
  font-size: em(14);
  line-height: (24/14);
  padding: rem(var(--input-padding-y)) rem(var(--input-padding-y));
}

.select-timezone-control {
  & select {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: transparent;
    background-color: transparent;
    background-image: none !important;
    padding: 0;
  }
}
</style>
