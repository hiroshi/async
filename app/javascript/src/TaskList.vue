<template>
  <ul>
    <li v-for="task in tasks" :key="task.id">
      <Task v-bind:taskId="task.id" />
    </li>
  </ul>
</template>

<script>
import Task from './Task.vue'

export default {
  components: { Task },
  created: async function () {
    this.fetchId = this.$store.getters.fetchId()
    this.$store.dispatch('fetchTasks', this.fetchId)
  },
  computed: {
    tasks () {
      return this.$store.getters.tasks(this.fetchId)
    }
  }
}
</script>

<style scoped>
/* p { */
/*   font-size: 2em; */
/*   text-align: center; */
/* } */
</style>
