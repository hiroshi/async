<template>
  <div>
    <h2>Tasks</h2>
    <form @submit.stop.prevent="create" ref="form">
      <input type="hidden" name="authenticity_token" v-bind:value="csrfToken" />
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <Task v-bind:taskId="task.id" />
      </li>
    </ul>
  </div>
</template>

<script>
import SocketProxy from "./SocketProxy"
import Task from './Task.vue'

export default {
  components: { Task },
  data: function () {
    return {
      taskListId: null,
      csrfToken: document.getElementsByName("csrf-token")[0].content
    }
  },
  created: async function () {
    this.fetchId = this.$store.getters.fetchId()
    this.$store.dispatch('fetchTasks', this.fetchId)
  },
  // destroyed: function () {
  //   SocketProxy.unsubscribe('tasks.new')
  // },
  computed: {
    tasks () {
      return this.$store.getters.tasks(this.fetchId)
    }
  },
  methods: {
    create: function () {
      const formData = new FormData(this.$refs.form)
      fetch("/tasks", {
        method: 'POST',
        body: formData
      }).then((res) => {
        this.$refs.form.reset()
      })
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
