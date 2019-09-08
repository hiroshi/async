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
import SocketProxy from "./SocketProxy"

export default {
  props: ['initialTask'],
  data: function () {
    return {
      task: this.initialTask,
      csrfToken: document.getElementsByName("csrf-token")[0].content
    }
  },
  mounted: function () {
    let vm = this
    this.$nextTick(() => {
      SocketProxy.subscribe(`tasks.${vm.task.id}.update`, (task) => {
        console.log(`tasks.${vm.task.id}.update`, task)
        // console.log(this.tasks)
        vm.task = task
      })
    })
  },
  destroyed: function () {
    SocketProxy.unsubscribe(`tasks.${task.id}.update`)
  },
  computed: {
    done: {
      get: function () {
        return !!this.task.done_at
      },
      set: function (val) {
        //console.log(val)
        const formData = new FormData(this.$refs.form)
        fetch(`/tasks/${this.task.id}`, {
          method: 'POST',
          body: formData
        }).catch((err) => {
          console.error(err)
          this.$refs.form.reset()
        })
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
