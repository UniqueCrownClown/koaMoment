import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  loginMan: {
    _id: window.sessionStorage.getItem('_id') || '',
    username: window.sessionStorage.getItem('username') || 'default',
    token: window.sessionStorage.getItem('token') || '',
    avatar: window.sessionStorage.getItem('avatar') || ''
  }
}

const mutations = {
  save: (state, data) => {
    state.loginMan._id = data._id
    state.loginMan.token = data.token
    state.loginMan.username = data.username
    state.loginMan.avatar = data.avatar

    window.sessionStorage.setItem('_id', data._id)
    window.sessionStorage.setItem('token', data.token)
    window.sessionStorage.setItem('username', data.username)
    window.sessionStorage.setItem('avatar', data.avatar)
  },
  remove: (state) => {
    state.loginMan.token = ''
    state.loginMan.username = ''
    state.loginMan.avatar = ''
    state.loginMan._id = ''

    window.sessionStorage.removeItem('_id')
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('username')
    window.sessionStorage.removeItem('avatar')
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
