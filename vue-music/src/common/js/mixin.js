import { mapGetters } from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playList)
  },
  activated () {
    this.handlePlaylist(this.playList)
  },
  methods: {
    handlePlaylist () {
      throw new Error('undefined handlePlaylist function')
    }
  },
  watch: {
    playList (newVal) {
      this.handlePlaylist(newVal)
    }
  }
}
