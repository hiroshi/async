import Vue from 'vue/dist/vue.esm'
import Tasks from '../src/Tasks.vue'

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    el: '#tasks',
    render: h => h(Tasks)
  })
})