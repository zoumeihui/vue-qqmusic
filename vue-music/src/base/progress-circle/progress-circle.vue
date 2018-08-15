<template>
  <div class="progress-circle">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" :width="radius" :height="radius">
      <circle class="progress-bar" cx="50" cy="50" r="50" fill="transparent" :stroke-dasharray="dasharray"
              :stroke-dashoffset="dashoffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        dasharray: Math.PI * 100
      }
    },
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    computed: {
      dashoffset () {
        return (1 - this.percent) * this.dasharray
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      stroke: $color-theme
    .progress-bar
      transform-origin: center
      transform: scale(0.9) rotate(-90deg)
</style>
