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
export default {
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
      return [{name: 'first'}, {name: 'second'}]
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
