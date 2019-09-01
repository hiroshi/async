<template>
  <div>
    <input type="checkbox" v-model="done">
    {{ task.name }}
  </div>
</template>

<script>
export default {
  props: ['task'],
  data: function () {
    return {
    //   task: null,
      done: this.task.done,
      csrfToken: document.getElementsByName("csrf-token")[0].content
    }
  },
  watch: {
    done: function (val) {
      console.log(val)
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
