<template lang="pug">

  .form-block._select
    label.form-block-label(
      :for="id"
    )
      slot

    slot(name="before-controls")

    .form-block-controls

      slot(name="before-control")

      .form-block-control
        select(
          :id="id"
          :value="value"
          v-bind="$attrs"
          v-on="listeners"
        )
          slot(name="options")
            option(
              v-for="option in options"
              :value="option.value"
            ) {{ option.label }}

      slot(name="after-control")

    slot(name="after-controls")

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class FormBlockInput extends Vue {
  @Prop() id?: string
  @Prop() value?: string
  @Prop() options?: {
    label: string
    value: string
  }[]

  get listeners() {
    return {
      ...this.$listeners,
      input: (e: any) => this.$emit('input', e.target.value),
    }
  }
}
</script>
