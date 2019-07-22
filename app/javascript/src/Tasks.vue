<template>
  <div>
    <h2>Tasks</h2>
    <form @submit.stop.prevent="create" ref="form">
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
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
