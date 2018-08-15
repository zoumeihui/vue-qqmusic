<template>
  <div class="disc">
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getSongList } from 'api/recommend'
  import { ERR_OK } from 'api/config'

  export default {
    components: {
      MusicList
    },
    created () {
      this._getSongList()
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    methods: {
      _getSongList () {
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
