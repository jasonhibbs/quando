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

        h2 Data
        p Quando stores data directly on your device so you can always access them offline.

        h3 Export
        p Copy your times to paste into another Quando.
        .form-block
          .form-block-controls._inline
            .form-block-control
              input(
                readonly
                :value="exportString"
                @click="onFocusExport"
                @focus="onFocusExport"
              )
            .form-block-control
              copyButton._key(
                :copy="exportString"
              )

        h2 Import
        p Add times copied from a Quando export.
        form(@submit.prevent="onSubmitImport")
          .form-block
            .form-block-controls._inline
              .form-block-control
                input(
                  placeholder="Paste here"
                  v-model="importString"
                )
              .form-block-control
                button._key(type="submit") Import

        p
          message(
            v-if="importedItems !== null"
            :type="importedItems < 0 ? 'bad' : 'good'"
          ) {{ importFeedback }}

        h2 Clear
        p Reset Quando and remove your times.
        button._bad(
          @click="onClickClear"
        ) Clear Times
        p
          message(v-if="itemsCleared" type="good") All times removed

        h2 Demo
        p Add some example items for fun.
        button(
          @click="onClickDemo"
        ) Add Demo Times
        p
          message(v-if="demoItemsAdded" type="good") Added the demo items

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
    if (this.importItems.length) {
      const newItems = this.importItems.filter((x: any) => {
        return !this.existingIds.includes(x.id)
      })

      this.importedItems = newItems.length

      for (let item of newItems) {
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
  & h2,
  & h3 {
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
