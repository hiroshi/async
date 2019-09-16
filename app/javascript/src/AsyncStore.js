import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    tasks: []
  },
  mutations: {
    setTasks (state, tasks) {
      state.tasks = tasks
    }
  },
  actions: {
    fetchTasks ({ commit }) {
      // commit('setTasks')
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
  
      fetch("/tasks", { headers }).then((res) => {
        return res.json()
      }).then((tasks) => {
        commit('setTasks', tasks)
      })
    }
  }
})