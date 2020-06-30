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

        h2#data Data
        p Quando saves times on your device so they’re always available offline.
        p You have {{ items.length }} {{ items.length === 1 ? 'time' : 'times' }} on this device.

        h3#import Import
        p Add times copied from a Quando export.
        form(@submit.prevent="onSubmitImport")
          .form-block._input
            .form-block-controls._inline
              .form-block-control
                input(
                  type="text"
                  aria-label="Paste import data"
                  placeholder="Paste here"
                  v-model="importString"
                )
              .form-block-control._min
                button._key(
                  type="submit"
                  :disabled="!importableItems.length"
                )
                  .button-label Import

          message(
            v-if="importString && importedItems === null"
            aria-live="polite"
          )
            p(v-if="importableItems.length") Ready to import {{ importableItems.length }} new {{ importableItems.length === 1 ? 'time' : 'times' }}
            p(v-if="!importableItems.length") No new times found

          message(
            v-if="importedItems !== null"
            :type="importedItems < 0 ? 'bad' : 'good'"
            aria-live="polite"
          )
            p {{ importFeedback }}

        h3#export Export
        p Copy your times to paste into another Quando.
        .form-block._input
          .form-block-controls._inline
            .form-block-control
              input(
                type="text"
                readonly
                aria-label="Export data for copying"
                :value="exportString"
                @click="onFocusExport"
                @focus="onFocusExport"
              )
            .form-block-control._min
              copyButton._key(
                :copy="exportString"
              )

        h3#delete Delete
        p Reset Quando and delete your times.
        button._bad(
          @click="onClickClear"
        ) Delete Times

        message(v-if="itemsCleared"
          type="good"
          aria-live="polite"
        )
          p All times removed

        h3#demo Demo
        p Add some example items for fun.
        button(
          @click="onClickDemo"
        ) Add Demo Times
        message(v-if="demoItemsAdded"
          type="good"
          aria-live="polite"
        )
          p Added the demo items

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
import Message from '@/components/Message.vue'

@Component({
  components: { Logo, CopyButton, Message },
  computed: mapState(['items']),
})
export default class More extends Vue {
  items!: any

  resetMessages() {
    this.importedItems = null
    this.demoItemsAdded = false
    this.itemsCleared = false
  }

  // Export

  get exportString() {
    return JSON.stringify(this.items)
  }

  onFocusExport(e: any) {
    e.target.select()
  }

  // Import

  importString: string = ''
  importedItems: number | null = null

  get existingIds() {
    return this.items.map((x: any) => x.id)
  }

  get importItems() {
    try {
      return JSON.parse(this.importString)
    } catch {
      return []
    }
  }

  get importableItems() {
    if (this.importItems.length) {
      return this.importItems.filter((x: any) => {
        const isDupe = this.existingIds.includes(x.id)
        const isTime = x.id && x.label && x.datetime && x.timezone
        return !isDupe && isTime
      })
    } else {
      return []
    }
  }

  get importFeedback() {
    switch (this.importedItems) {
      case -1:
        return 'Couldn’t read that, try copying again'
      case 0:
        return 'Nothing new to add!'
      case 1:
        return 'Added one new time'
      default:
        return `Added ${this.importedItems} new times`
    }
  }

  onSubmitImport() {
    this.resetMessages()
    if (this.importableItems.length) {
      this.importedItems = this.importableItems.length
      for (const item of this.importableItems) {
        this.$store.commit('addItem', item)
      }
    } else {
      this.importedItems = -1
    }
  }

  // Clear

  itemsCleared = false
  onClickClear() {
    if (confirm('You’ll never see these times again')) {
      this.$store.commit('removeItems')
      this.resetMessages()
      this.itemsCleared = true
    }
  }

  // Demo

  demoItemsAdded = false
  onClickDemo() {
    this.$store.commit('pushDemoItems')
    this.resetMessages()
    this.demoItemsAdded = true
  }
}
</script>

<style lang="scss">
@import '../assets/scss/util';

.screen-more {
  & .bar h1 {
    margin: 0 0 rem(7);
  }

  & main {
    padding-bottom: rem(80);
  }

  & h2 {
    margin: rem(36) auto rem(12);
  }
  & h3 {
    margin: rem(48) auto rem(12);
  }

  & p {
    margin-top: 0;
  }

  & .message {
    margin-top: var(--space-rem-small);
  }

  & input[readonly] {
    --border-color: var(--contrast-light);
    --background-color: transparent;
  }
}

footer {
  box-shadow: 0 -1px 0 var(--contrast-lighter);
  padding: rem(12) 0 rem(96);

  & p {
    @include font-size(13, 16);
  }
}
</style>
