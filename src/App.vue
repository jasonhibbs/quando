<template lang="pug">

  #app

    transition(
      name="slide-up"
      appear
    )
      dialog(
        v-if="!isStorageUnderstood"
        open
      )
        form(
          method="dialog"
          @submit.prevent="onStorageUnderstood"
        )
          .layout
            h1 Your Data
            p This app saves your data to local storage. You can delete this in the #[a(href="/more/#delete") #[em More] menu] at any&nbsp;time.
            button(type="submit") Understood

    transition(:name="transitionName")
      router-view

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: mapState(['user', 'ui', 'items']),
})
export default class App extends Vue {
  user!: any
  ui!: any
  items!: any
  transitionName: string = 'default'

  queryDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  isStandalone = window.matchMedia('(display-mode: standalone)').matches
  isIos = /iPhone|iPad|iPod/.test(navigator.userAgent)

  created() {
    if (this.isStandalone) {
      document.documentElement.classList.add('is-app')
    }
    if (this.isIos) {
      document.documentElement.classList.add('is-ios')
    }
    document.addEventListener('workerupdated', this.onWorkerUpdated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.ui.reloading) return
      this.ui.reloading = true
      location.reload()
    })
  }

  mounted() {
    this.user.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.onDarkModeChange(this.queryDarkMode)
    this.queryDarkMode.addListener(this.onDarkModeChange)

    if (this.items.length) {
      this.$store.commit('understoodStorage')
    }
  }

  get isStorageUnderstood() {
    return this.user.storageUnderstood || this.items.length
  }

  onStorageUnderstood() {
    this.$store.commit('understoodStorage')
  }

  onWorkerUpdated(e: any) {
    this.$store.commit('workerFoundUpdate', e.detail)
  }

  onDarkModeChange(query: any) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      if (query.matches) {
        metaThemeColor.setAttribute('content', '#000')
      } else {
        metaThemeColor.setAttribute('content', '#fff')
      }
    }
  }

  @Watch('$route') onRouteChange(to: any, from: any) {
    const toDepth = to.path.split('/').filter(Boolean).length
    const fromDepth = from.path.split('/').filter(Boolean).length
    let rightwards = toDepth < fromDepth

    if (to.name === 'More') {
      rightwards = true
    }

    this.transitionName = rightwards ? 'slide-right' : 'slide-left'
  }
}
</script>
<style lang="scss">
@import 'assets/scss/util';

dialog {
  position: fixed;
  bottom: 0;
  z-index: 99;
  border: none;
  padding: rem(20);
  padding-bottom: rem(72);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 0 12px var(--shade-light), 0 0 0 1px var(--shade-lighter);

  text-align: center;

  ::backdrop {
    bottom: blue;
  }

  & .layout {
    width: auto;
    max-width: rem(360);
  }

  & h1 {
    @include font-size(21, 24);
    margin: 0;
  }

  @media (min-width: 480px) {
    bottom: rem(40);
    border-radius: 12px;
    padding: rem(28);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s cubic-bezier((1/4), (10/12), (1/10), 1);
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);

  @media (min-width: 480px) {
    transform: translateY(calc(100% + (40rem / 16)));
  }
}
</style>
