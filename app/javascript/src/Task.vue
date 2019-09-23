<template>
  <form ref="form">
    <input type="hidden" name="authenticity_token" v-bind:value="csrfToken" />
    <input type="hidden" name="_method" value="patch" />
    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" v-model="done" value="1">
    {{ task.name }}
  </form>
</template>

<script>
export default {
  props: ['taskId'],
  data: function () {
    return {
      csrfToken: document.getElementsByName("csrf-token")[0].content
    }
  },
  destroyed: function () {
    SocketProxy.unsubscribe(`tasks.${taskId}.update`)
  },
  computed: {
    task () {
      return this.$store.getters.getTaskById(this.taskId)
    },
    done: {
      get: function () {
        return !!this.task.done_at
      },
      set: function (val) {
        const formData = new FormData(this.$refs.form)
        this.$store.dispatch('updateTask', { taskId: this.taskId, formData })
      }
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
