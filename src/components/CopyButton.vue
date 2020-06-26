<template lang="pug">

  button.copy-button._primary(
    ref="el"
    type="button"
    v-clipboard:copy="copy"
    v-clipboard:success="onCopySuccess"
    v-clipboard:error="onCopyFail"
  )
    template(v-if="copySuccess")
      slot(name="success")
        i.fal.fa-check
        span Copied
    template(v-else-if="copyFail")
      slot(name="fail")
        i.fal.fa-times
        span Failed
    template(v-else)
      slot
        i.fa.fa-copy
        span Copy


</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'

@Component
export default class CopyButton extends Vue {
  @Prop({ type: String }) copy!: string
  @Ref('el') readonly button!: HTMLButtonElement

  labelTimeout: number = 1600
  copySuccess: boolean = false
  copyFail: boolean = false

  onCopySuccess() {
    this.copySuccess = true
    this.onCopyDone()
  }

  onCopyFail() {
    this.copyFail = true
    this.onCopyDone()
  }

  onCopyDone() {
    this.button.focus()
    setTimeout(() => {
      this.copySuccess = false
      this.copyFail = false
    }, this.labelTimeout)
  }
}
</script>
