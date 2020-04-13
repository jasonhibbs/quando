<template lang="pug">

  #app
    transition(:name="transitionName")
      router-view

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import HelloWorld from './components/HelloWorld.vue'

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  transitionName: string = 'default'

  @Watch('$route') onRouteChange(to: any, from: any) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}
</script>
