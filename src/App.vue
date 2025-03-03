<script setup lang="ts">
// import { reactive } from 'vue'
import { Human } from './domain/human'
// import { User } from './domain/user'
// const user = new User()
// debugger
// //use from to deserialize the json..
// user.from({ name: 'Anas', car: { make: 'Benz' } })
// console.log(user)
const h = new Human()
debugger
h.age = -1
h.from({ semsem: { name: 'AbcX' } })
console.log('$$$$$$$$$ ', h)
window.human = h
const click = async () => {
  console.log(await h.validate())
}

debugger
</script>
<template>
  <button @click="click">validate</button>
  <h1>corello</h1>
  <p>Open the console</p>
  <!--<p>Name :{{ user.name }}</p>
  <p>JSON{{ JSON.stringify(user) }}</p>
  <p>is typeof User? :{{ user instanceof User }}</p> -->
  <hr />
  Enter Age
  <input type="number" v-model="h.age" />
  <small>{{ h.v?.age?.result?.isOk }}</small>
  <br />
  <pre style="width: 100%">{{ h.v }}</pre>

  <small>{{ h.v?.semsem?.result?.isOk }}</small>
</template>
