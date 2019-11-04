<template>
  <form ref="form">
    <input type="hidden" name="authenticity_token" v-bind:value="csrfToken" />
    <input type="hidden" name="_method" value="patch" />
    <span v-bind:class="{ done }">
      {{ task.name }}
    </span>
    <button v-if="done" v-on:click.stop.prevent="updateDone(false)">undone</button>
    <button v-else v-on:click.stop.prevent="updateDone(true)">done</button>
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
  // SocketProxy.subscribe/unsubscribe should be done in stores.
  // destroyed: function () {
  //   SocketProxy.unsubscribe(`tasks.${taskId}.update`)
  // },
  computed: {
    task () {
      return this.$store.getters.getTaskById(this.taskId)
    },
    done () {
      return !!this.task.done_at
    }
  },
  methods: {
    updateDone: function (value) {
      const formData = new FormData(this.$refs.form)
      formData.append('done', value)
      this.$store.dispatch('updateTask', { taskId: this.taskId, formData })
    }
  }
}
</script>

<style scoped>
/* p { */
/*   font-size: 2em; */
/*   text-align: center; */
/* } */
.done {
  text-decoration: line-through;
}
</style>
