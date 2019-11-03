<template>
  <div>
    <h2>Tasks</h2>
    <form @submit.stop.prevent="create" ref="form">
      <input type="hidden" name="authenticity_token" v-bind:value="csrfToken" />
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
    <TaskList :query="{done: true}" />
    <TaskList :query="{done: false}" />
  </div>
</template>

<script>
import SocketProxy from "./SocketProxy"
import TaskList from './TaskList'

export default {
  components: { TaskList },
  data: function () {
    return {
      csrfToken: document.getElementsByName("csrf-token")[0].content
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
