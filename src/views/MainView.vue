<template>
  <div class="flex h-full flex-col items-center justify-center space-y-12">
    <img src="/sporting.jpeg" alt="Sporting CP" class="w-64" />
    <h1 class="text-3xl font-bold underline">🦁 Memória Leonina</h1>
    <ul>
      <li class="rounded-lg bg-green-800 p-4 text-xl text-white">
        <router-link to="/new-game">Start a new Game</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import useImagePreloader from '../composables/useImagePreloader'
import usePlayersList from '../composables/usePlayersList'

const { players } = usePlayersList()
const { preloadImages } = useImagePreloader()

const imagesToPreload = players.value.map(player => player.image)
imagesToPreload.push('/badge.svg')

preloadImages(imagesToPreload)
</script>
