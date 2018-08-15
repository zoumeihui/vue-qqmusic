<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart="progressTouchStart"
           @touchmove="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  const transform = prefixStyle('transform')
  const progressBtnWidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      progressTouchStart (e) {
        this.touch.initialed = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        if (!this.touch.initialed) {
          return
        }
        let deltaX = e.touches[0].pageX - this.touch.startX
        let offsetWidth = Math.min((this.$refs.progressBar.clientWidth - progressBtnWidth), Math.max(0, this.touch.left + deltaX))
        this._setProgress(offsetWidth)
      },
      progressTouchEnd () {
        this.touch.initialed = false
        this._trigger(this.getPercent())
      },
      progressClick (e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        this._setProgress(e.pageX - rect.left)
        this._trigger(this.getPercent())
      },
      getPercent () {
        let progressWidth = this.$refs.progress.clientWidth
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        return progressWidth / barWidth
      },
      _setProgress (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _trigger (precent) {
        this.$emit('precentChange', precent)
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initialed) {
          let progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          let progressWidth = progressBarWidth * newPercent
          this._setProgress(progressWidth)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      width: 100%
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
