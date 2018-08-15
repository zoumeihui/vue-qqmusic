<template>
  <scroll :data="data" class="list-view" ref="scroll" :probeType="probeType" :listen-scroll="listenScroll"
          @scroll="scroll">
    <ul>
      <li class="list-group" v-for="(group, index) in data" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" @click="selectItem(item)" v-for="(item, index) in group.items" :key="index">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" :key="index" class="list-shortcut-item"
            :class="{'active': index===currentIndex}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixedTop">
      <h1 class="list-fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import { getData } from 'common/js/dom'
  import Loading from 'base/loading/loading'

  const ANCHOR_HEIGHT = 18
  const FIXED_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -1
      }
    },
    created () {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    components: {
      Scroll,
      Loading
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substring(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      refresh () {
        this.$refs.scroll.refresh()
      },
      selectItem (item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart (e) {
        this.touch.y1 = e.touches[0].pageY
        let target = e.target
        let anchorIndex = getData(target, 'index')
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        this.touch.y2 = e.touches[0].pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + parseInt(delta)
        this._scrollTo(anchorIndex)
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      _scrollTo (index) {
        if (index < 0) {
          index = 0
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight () {
        this.listHeight = []
        let height = 0
        this.listHeight.push(height)
        let listGroup = this.$refs.listGroup
        for (let i = 0; i < listGroup.length; i++) {
          let itemHeight = listGroup[i].clientHeight
          height += itemHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        let listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (Math.abs(newY) >= height1 && Math.abs(newY) < height2) {
            this.currentIndex = i
            this.diff = height2 - Math.abs(newY)
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixedTop.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .list-view
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    .list-group
      padding-bottom: 30px
      .list-group-title
        padding: 8px 0 8px 20px
        background: $color-highlight-background
        font-size: $font-size-medium
        color: $color-text-l
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        line-height: 1
        .avatar
          flex: 0 0 50px
          display: inline-block
          width: 50px
          height: 50px
          margin-right: 20px
          border-radius: 50%
        .name
          font-size: $font-size-medium
          color: $color-text-l
    .list-shortcut
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      z-index: 30
      .list-shortcut-item
        padding: 6px 16px 0
        font-size: $font-size-small
        color: $color-text-l
        text-align: center
        &.active
          color: $color-theme
    .list-fixed
      position: absolute
      left: 0
      top: 0
      width: 100%
      background: $color-highlight-background
      .list-fixed-title
        height 30px
        line-height: 30px
        padding-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      left: 0
      transform: translateY(-50%)
</style>
