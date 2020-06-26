<template lang="pug">

  .screen.screen-more

    header.bar
      .bar-block
        router-link.bar-button._end(
          :to="{ name: 'List' }"
        ) Done

      .bar-block
        h1
          logo(type)

    main
      .layout

        h2 Export
        p Copy your data to paste into another Quando.
        copyButton(
          :copy="exportString"
        )

        h2 Import
        p Add data copied from a Quando export.
        .form-block
          .form-block-controls._inline
            .form-block-control
              input(placeholder="Paste here")
            .form-block-control
              button._key Import

        h2 Clear
        p Reset Quando and remove your data.
        button._bad Clear

        h2 Demo
        p Add some example items for fun.
        button Add

    footer
      .layout
        p Set in #[a(href="https://manropefont.com/") Manrope]
        p Built with #[a(href="https://vuejs.org/") Vue]
        p Powered by #[a(href="https://www.netlify.com/") Netlify]
        p.vcard.h-card Made by #[a.p-name.u-url.fn.url(href="https://jasonhibbs.co.uk") Jason Hibbs]

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Logo from '@/components/Logo.vue'
import CopyButton from '@/components/CopyButton.vue'

@Component({
  components: { Logo, CopyButton },
  computed: mapState(['items']),
})
export default class More extends Vue {
  items!: any

  get exportString() {
    return JSON.stringify(
      this.items.map((time: any) => {
        delete time.id
        return time
      })
    )
  }

  onClickCopy() {
    this.$copyText(this.exportString, this.onCopySuccess, this.onCopyFail)
  }
}
</script>

<style lang="scss">
@import '../assets/scss/util';

.screen-more {
  & h2 {
    margin: rem(60) auto rem(12);
  }
}

footer {
  background-color: var(--contrast-lightest);
  padding: rem(12) 0 rem(96);

  & p {
    @include font-size(13, 16);
  }
}
</style>
