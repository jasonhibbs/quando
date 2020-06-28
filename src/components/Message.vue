<template lang="pug">

  .message(:class="classes")
    .message-inner
      slot

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Message extends Vue {
  @Prop() private type?: string

  get classes() {
    const classes = []

    if (this.type) {
      classes.push(`_${this.type}`)
    }

    return classes
  }
}
</script>
<style lang="scss">
.message {
  padding: 0.5rem 0.625rem;
  background-color: var(--color-key-10);
  border-left: 4px solid var(--color-key-50);

  &._good {
    background-color: var(--color-good-10);
    border-left-color: var(--color-good);
  }

  &._bad {
    background-color: var(--color-bad-10);
    border-left-color: var(--color-bad);
  }

  & :first-child {
    margin-top: 0;
  }

  & :last-child {
    margin-bottom: 0;
  }
}
</style>
