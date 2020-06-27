<template lang="pug">

  .logo(:class="classes")
    svg.icon(
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 4 4"
    )
      defs
        linearGradient#dial(x1="0" y1="0" x2="0" y2="1")
          stop(offset="0%" stop-color="var(--dial-top)")
          stop(offset="100%" stop-color="var(--dial-bottom)" transition="stop-color 2s ease-out")
        linearGradient#gnomon
          stop(offset="0%" stop-color="var(--gnomon-left)")
          stop(offset="100%" stop-color="var(--gnomon-right)")
        clipPath#clip
          circle(cx="2" cy="2" r="2")
      circle#dial(cx="2" cy="2" r="2" fill="url(#dial)")
      path#shadow(d="M 2 2 V 4 H 4 V 3 Z" fill="var(--shadow-alpha)" clip-path="url(#clip)")
      path#gnomon(d="M 2 2 V 4 H 4 Z" fill="url(#gnomon)")

    .type(v-if="type") quando

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Logo extends Vue {
  @Prop({ default: false, type: Boolean }) type!: boolean
  @Prop({ default: false, type: Boolean }) flat!: boolean
  @Prop({ default: false, type: Boolean }) line!: boolean

  get classes() {
    return {
      _type: this.type,
      _flat: this.flat,
      _line: this.line,
    }
  }
}
</script>

<style lang="scss">
.logo {
  --size: 1em;
  --balance: 0;

  --dial: hsl(220, 100%, 60%);
  --dial-top: hsl(220, 100%, 50%);
  --dial-bottom: hsl(204, 100%, 75%);
  --gnomon: hsl(212, 100%, 83%);
  --gnomon-left: hsl(212, 100%, 91%);
  --gnomon-right: hsl(220, 100%, 75%);
  --shadow: hsl(220, 100%, 33%);
  --shadow-alpha: hsla(220, 100%, 33%, 66%);
  --text: hsl(220, 33%, 16%);
  --text-hover: hsl(216, 100%, 50%);

  position: relative;
  display: flex;
  align-items: baseline;
  line-height: (22/16);
  padding-top: var(--balance);
  text-decoration: none;

  &:before,
  &:after {
    // content: '';
    background-color: #f007;
    width: 100%;
    height: var(--balance);
    position: absolute;
    top: 0;
  }

  &:after {
    top: initial;
    bottom: 0;
  }

  &:focus,
  &:hover {
    #shadow {
      d: path('M 2 2 V 4 H 4 V 2.5 Z');
    }
  }

  &._type {
    --size: #{(7em/6)};
    --balance: #{(4em/16)};
  }

  &._flat {
    #dial {
      fill: var(--dial);
    }
    #gnomon {
      fill: var(--gnomon);
    }
    #shadow {
      fill: var(--shadow);
    }
  }

  &._line {
    .icon {
      overflow: visible;
    }
    #dial,
    #gnomon {
      fill: white;
    }
    #dial,
    #gnomon,
    #shadow {
      stroke: var(--dial);
      stroke-linejoin: round;
      stroke-width: calc((4 / 32) * 1);
      stroke-alignment: inside;
    }
    #shadow {
      fill: var(--dial);
    }
  }
}

.icon {
  display: block;
  flex: none;
  width: var(--size);

  #dial {
    transition: opacity (2s/3) ease-out;
  }

  #shadow {
    clip-path: circle(100% at 0 0);
    transition: d (2s/3) ease-out;
  }
}

.type {
  font-weight: 700;
  margin-left: 0.25em;
  transition: color (2s/3);
}
</style>
