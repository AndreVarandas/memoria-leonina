<template>
  <section class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
    <template v-for="card in cards" :key="card.id">
      <MemoryCard
        :card="card"
        @click="handleCardClick(card)"
        :disabled="card.disabled"
      />
    </template>
  </section>
</template>

<script setup>
/**
 * Represents a card in the game.
 *
 * @typedef {Object} Card
 * @property {number} id - The unique identifier of the card.
 * @property {boolean} flipped - Indicates if the card is currently flipped.
 * @property {boolean} matched - Indicates if the card has been matched with another card.
 * @property {Player} player - The player associated with the card.
 */
import confetti from 'canvas-confetti'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

import MemoryCard from '../components/MemoryCard.vue'
import useMemoryGame from '../composables/useMemoryGame'
import useSound from '../composables/useSound'

const {
  cards,
  flipCard,
  handleMatchedCards,
  isMatching,
  isVictory,
  resetGame,
} = useMemoryGame()
const router = useRouter()
const { playVictorySound, playFlipSound } = useSound()
const VICTORY_DELAY_MS = 1000

// Watch the victory state and handle it when the user wins.
watch(isVictory, victory => {
  if (victory) {
    handleVictory()
  }
})

/**
 * Handles the beforeRouteLeave navigation guard.
 * This guard is called whenever the user tries to leave the route - we can use it
 * to ask the user if they really want to leave the game.
 */
onBeforeRouteLeave(async () => {
  const hasInteractedWithCards = cards.value.some(
    card => card.flipped || card.matched,
  )

  if (!isVictory.value && hasInteractedWithCards) {
    const anwser = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose your progress!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave the game!',
      cancelButtonText: 'No, stay',
    })

    return anwser.isConfirmed
  }

  return true
})

/**
 * Handles the click event when a card is clicked.
 *
 * @param {Card} card - The card that was clicked.
 */
function handleCardClick(card) {
  if (canFlipCard(card) && !isMatching.value) {
    flipCard(card)
    playFlipSound()
    handleMatchedCards()
  }
}

/**
 * Checks if a card can be flipped.
 *
 * @param {Card} card - The card to check.
 * @returns {boolean} - True if the card can be flipped, false otherwise.
 */
function canFlipCard(card) {
  return !card.matched && !card.flipped && !card.disabled
}

/**
 * Handles the victory condition.
 */
async function handleVictory() {
  confetti({
    particleCount: 150,
    spread: 180,
  })
  playVictorySound()

  setTimeout(async () => {
    const anwser = await Swal.fire({
      title: 'You won!',
      text: 'Do you want to play again?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, play again!',
      cancelButtonText: 'No, leave',
    })

    if (anwser.isConfirmed) {
      resetGame()
      isVictory.value = false
    } else {
      router.push({ name: 'Home' })
    }
  }, VICTORY_DELAY_MS)
}
</script>
