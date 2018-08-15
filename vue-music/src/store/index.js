import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import state from './state'
import * as getters from './getters'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  state,
  getters,
  mutations,
  plugins: debug ? [createLogger()] : [],
  strict: debug
})
