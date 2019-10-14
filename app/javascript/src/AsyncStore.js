import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
Vue.use(Vuex)
import SocketProxy from "./SocketProxy"

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    fetches: []
  },
  getters: {
    fetchId: (state) => () => {
      return 0
    },
    tasks: (state) => (fetchId) => {
      return state.fetches[fetchId]
    },
    getTaskById: (state, getters) => (taskId) => {
      let task
      state.fetches.forEach(tasks => {
        task = tasks.find(task => task.id === taskId)
        if (task) {
          return
        }
      })
      return task
    }
  },
  mutations: {
    setTasks (state, {fetchId, tasks}) {
      const store = this
      Vue.set(state.fetches, fetchId, tasks)

      SocketProxy.subscribe('tasks.new', (task) => {
        store.commit('pushTask', task)
      })
  
      tasks.forEach(task => {
        SocketProxy.subscribe(`tasks.${task.id}.update`, (task) => {
          store.commit('updateTask', task)
        })
      })
    },
    pushTask (state, t) {
      state.tasks.push(t)
    },
    updateTask (state, t) {
      const task = this.getters.getTaskById(t.id)
      Object.assign(task, t)
    }
  },
  actions: {
    fetchTasks ({ commit, state }, fetchId) {
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      fetch("/tasks", { headers }).then((res) => {
        return res.json()
      }).then((tasks) => {
        commit('setTasks', {fetchId, tasks})
      })
    },
    updateTask ({ commit }, { taskId, formData }) {
      fetch(`/tasks/${taskId}`, {
        method: 'POST',
        body: formData
      }).catch((err) => {
        console.error(err)
      })
    }
  }
})