import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
Vue.use(Vuex)
import SocketProxy from "./SocketProxy"


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    tasks: []
  },
  getters: {
    getTaskById: (state) => (id) => {
      return state.tasks.find(task => task.id === id)
    }
  },
  mutations: {
    setTasks (state, tasks) {
      const store = this
      state.tasks = tasks
      state.tasks.forEach(task => {
        SocketProxy.subscribe(`tasks.${task.id}.update`, (t) => {
          //console.log(`tasks.${t.id}.update`, t)
          //Object.assign(task, t)
          store.commit('updateTask', t)
        })
      })
    },
    updateTask (state, t) {
      const task = this.getters.getTaskById(t.id)
      Object.assign(task, t)
    }
  },
  actions: {
    fetchTasks ({ commit }) {
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
  
      fetch("/tasks", { headers }).then((res) => {
        return res.json()
      }).then((tasks) => {
        commit('setTasks', tasks)
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