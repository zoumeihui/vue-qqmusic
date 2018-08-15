<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="setBgStyle" ref="bgImage">
      <div class="play-wrapper" ref="playWrapper">
        <div v-show="songs.length" class="play" @click="randPlay">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songs" class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll"
            @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import { mapActions } from 'vuex'
  import { playlistMixin } from 'common/js/mixin'

  const RESERVED_HEIGHT = 40

  export default {
    mixins: [playlistMixin],
    data () {
      return {
        scrollY: 0
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default () {
          return []
        }
      },
      bgImage: {
        type: String,
        default: ''
      }
    },
    computed: {
      setBgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted () {
      this.bgHeight = this.$refs.bgImage.clientHeight
      this.maxTranslateY = -this.bgHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style = `top:${this.bgHeight}px`
    },
    methods: {
      handlePlaylist (playList) {
        this.$refs.list.$el.style.bottom = playList.length >= 1 ? '60px' : ''
        this.$refs.list.refresh()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      randPlay () {
        console.log('1111')
        console.log(this.songs)
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.maxTranslateY, newY)
        let zIndex = 0
        let scale = 1
        this.$refs.bgLayer.style.transform = `translate3d(0,${translateY}px,0)`
        this.$refs.bgLayer.style.webkitTransform = `translate3d(0,${translateY}px,0)`
        let bgImage = this.$refs.bgImage
        if (newY < this.maxTranslateY) {
          zIndex = 10
          bgImage.style.paddingTop = 0
          bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playWrapper.style.display = 'none'
        } else {
          bgImage.style.paddingTop = '70%'
          bgImage.style.height = 0
          this.$refs.playWrapper.style.display = ''
        }
        if (newY > 0) {
          zIndex = 10
          let percent = newY / this.bgHeight
          scale = scale + percent
          bgImage.style.transform = `scale(${scale})`
          bgImage.style.webkitTransform = `scale(${scale})`
        }
        bgImage.style.zIndex = zIndex
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin.styl"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    right: 0
    bottom: 0
    left: 0
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .fliter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
