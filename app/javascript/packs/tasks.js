import Vue from 'vue/dist/vue.esm'
import Tasks from '../src/Tasks.vue'
import store from '../src/AsyncStore'

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: '#tasks',
    store,
    render: h => h(Tasks)
  })
})
