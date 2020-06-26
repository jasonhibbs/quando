<template lang="pug">

  #app
    transition(:name="transitionName")
      router-view

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: mapState(['user', 'ui']),
})
export default class App extends Vue {
  user!: any
  ui!: any
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
