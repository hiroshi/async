<template>
  <div>
    <h2>Tasks</h2>
    <form @submit.stop.prevent="create" ref="form">
      <input type="hidden" name="authenticity_token" v-bind:value="csrfToken" />
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
    <ul>
      <li v-for="task in tasks">
        {{ task.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import SocketProxy from "./SocketProxy"

export default {
  mounted: function () {
    SocketProxy.subscribe('tasks.new', (data) => {
      console.log(data)
    })
  },
  destroyed: function () {
    SocketProxy.unsubscribe('tasks.new')
  }
  methods: {
    create: function () {
      const formData = new FormData(this.$refs.form)
      fetch("/tasks", {
        method: 'POST',
        body: formData
      })
    }
  },
  computed: {
    tasks: function () {
      let headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      return fetch("/tasks", { headers })
    },
    csrfToken: function () {
      // return $('meta[name="csrf-token"]').content
      return document.getElementsByName("csrf-token")[0].content
    }
  }
  // data: function () {
  //   return {
  //     message: "Hello Vue!"
  //   }
  // }
}
</script>

<style scoped>
/* p { */
/*   font-size: 2em; */
/*   text-align: center; */
/* } */
</style>
