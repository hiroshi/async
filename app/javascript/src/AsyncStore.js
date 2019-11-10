import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex'
Vue.use(Vuex)
import SocketProxy from "./SocketProxy"

function queryString(query) {
  const params = new URLSearchParams()
  Object.keys(query).forEach((k) => params.append(k, query[k]))
  return params.toString()
}


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    fetches: []
  },
  getters: {
    fetchId: (state) => (query) => {
      return JSON.stringify(query)
    },
    tasks: (state) => (fetchId) => {
      return state.fetches[fetchId]
    },
    getTaskById: (state, getters) => (taskId) => {
      let task
      Object.values(state.fetches).find(tasks => {
        task = tasks.find(task => task.id === taskId)
        return task
      })
      return task
    }
  },
  mutations: {
    setTasks (state, {fetchId, tasks}) {
      const store = this
      Vue.set(state.fetches, fetchId, tasks)

      // SocketProxy.subscribe('tasks.new', (task) => {
      //   store.commit('pushTask', task)
      // })

      const qs = queryString(JSON.parse(fetchId))
      SocketProxy.subscribe(`tasks?${qs}`, (tasks) => {
        store.commit('updateTasks', {fetchId, tasks})
      })
  
      tasks.forEach((task) => {
        SocketProxy.subscribe(`tasks.${task.id}.update`, (task) => {
          store.commit('updateTask', task)
        })
      })
    },
    updateTasks (state, {fetchId, tasks}) {
      // TODO: unsubscribe old tasks from 'updateTask' and subscribe new tasks
      Vue.set(state.fetches, fetchId, tasks)
    },
    // pushTask (state, t) {
    //   state.fetches[0].push(t)
    // },
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
      const qs = queryString(JSON.parse(fetchId))
      fetch(`/tasks?${qs}`, { headers }).then((res) => {
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
    },
    patchTask ({ commit }, { taskId, task }) {
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': document.getElementsByName("csrf-token")[0].content,
        'X-HTTP-Method-Override': 'patch'
      })
      fetch(`/tasks/${taskId}`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ task })
      }).catch((err) => {
        console.error(err)
      })
    }
  }
})