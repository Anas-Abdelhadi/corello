<script setup lang="ts">
import { User } from './domain/user'
const user = new User()
//use from to deserialize the json..
user.from({ name: 'Anas', car: { make: 'Benz' } })
console.log(user)
</script>

<template>
  <h1>corello</h1>
  <p>Open the console</p>
  <p>Name :{{ user.name }}</p>
  <p>JSON{{ JSON.stringify(user) }}</p>
  <p>is typeof User? :{{ user instanceof User }}</p>
</template>
