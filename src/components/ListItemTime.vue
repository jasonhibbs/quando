<template lang="pug">

  component.times-item(
    :is="tag"
    :to="href"
  )
    .times-item-inner
      .times-item-label {{ timeLabel }}
      .times-item-time
        time-string(
          :datetime="time.datetime"
          :unit="time.display"
        )

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { formatDistanceStrict } from 'date-fns'
import TimeString from '@/components/TimeString.vue'

@Component({
  components: { TimeString },
})
export default class ListItemTime extends Vue {
  @Prop() time!: {
    id?: string
    label: string
    datetime: string
    display?: string
  }

  get id() {
    return this.time.id
  }

  get href() {
    return !this.id ? null : { name: 'Single', params: { id: this.id } }
  }

  get tag() {
    return this.href ? 'router-link' : 'div'
  }

  get timeLabel() {
    return this.time.label
  }
}
</script>
<style lang="scss">
@import '../assets/scss/util';

.times-item {
  display: block;
  line-height: 1.25;
  box-shadow: 0 1px 0 var(--contrast-lightest);
}

.times-item-inner {
  width: var(--layout-base);
  max-width: var(--layout-measure);
  margin: 0 auto;
  padding: rem(16) 0;
  padding-right: env(safe-area-inset-right);
  padding-left: env(safe-area-inset-left);
}

a.times-item {
  &,
  &:focus,
  &:hover {
    color: var(--color-text);
  }

  &:hover {
    background-color: var(--contrast-lightest);
  }

  &:focus {
    outline-offset: -3px;
  }
}

div.times-item {
  background-color: var(--color-root);
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--contrast-lightest),
    0 1px 1rem var(--contrast-lighter);
}

div > .times-item-inner {
  padding: rem(16) rem(18);
}

.times-item-label {
  font-size: clamp(1rem, 5vw, em(32));
}
.times-item-time {
  font-size: clamp(1.5rem, 8vw, em(48));
  text-indent: (1em/-20);
}
</style>
