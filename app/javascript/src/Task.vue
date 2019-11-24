<template>
  <div>
    <input v-if="!done" type="checkbox" name="checked" value="1" v-model="checked" autocomplete="off" />
    <span v-if="nameEditing">
      <input name="name" ref="name" v-bind:value="task.name" @keyup.enter="enterName" @keyup.esc="nameEditing=false" />
      <button v-on:click="nameEditing=false">cancel</button>
    </span>
    <span v-else v-bind:class="{ done }" @click="editName">
      {{ task.name }}
      <button v-if="done" v-on:click.stop.prevent="update({done: false})">undone</button>
      <button v-else v-on:click.stop.prevent="update({done: true})">done</button>
    </span>
  </div>
</template>

<script>
export default {
  props: ['taskId'],
  data: function () {
    return {
      nameEditing: false,
      task: this.$store.getters.getTaskById(this.taskId)
    }
  },
  // SocketProxy.subscribe/unsubscribe should be done in stores.
  // destroyed: function () {
  //   SocketProxy.unsubscribe(`tasks.${taskId}.update`)
  // },
  computed: {
    done () {
      return !!this.task.done_at
    },
    checked : {
      get () {
        return this.task.checked
      },
      set (checked) {
        this.$store.dispatch('updateTask', { taskId: this.taskId, task: { checked }})
      }
    }
  },
  methods: {
    editName: function () {
      this.nameEditing = true
      this.$nextTick(() => {
        this.$refs.name.focus()
      })
    },
    enterName: function (event) {
      this.update({name: event.target.value})
      this.nameEditing = false
    },
    update: function (task) {
      this.task = Object.assign(this.task, task)
      this.$store.dispatch('updateTask', { taskId: this.taskId, task })
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
input {
  font-size: 15px;
}
</style>
