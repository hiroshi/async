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
        {{ task.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import SocketProxy from "./SocketProxy"

export default {
  data: function () {
    return {
      tasks: [],
      csrfToken: document.getElementsByName("csrf-token")[0].content
    }
  },
  mounted: function () {
    SocketProxy.subscribe('tasks.new', (task) => {
      // console.log(task)
      // console.log(this.tasks)
      let tasks = this.tasks
      tasks.push(task)
      this.tasks = tasks
    })

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })

    fetch("/tasks", { headers }).then((res) => {
      return res.json()
    }).then((tasks) => {
      this.tasks = tasks
    })
  },
  destroyed: function () {
    SocketProxy.unsubscribe('tasks.new')
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
