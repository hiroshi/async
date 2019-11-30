<template>
  <div>
    <input v-if="!done" type="checkbox" name="checked" value="1" v-model="checked" autocomplete="off" />
    <form v-if="nameEditing" @submit.prevent="enterName">
      <input name="name" ref="name" v-bind:value="task.name" @keyup.esc="nameEditing=false" />
      <a href="#cancel" v-on:click.prevent="nameEditing=false">cancel</a>
      <button type="submit">update</button>
    </form>
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
    enterName: function () {
      this.update({name: this.$refs.name.value})
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
form {
  display: inline;
}
</style>
