<script setup>
import { TowerEvent } from '@/models/TowerEvent.js';

defineProps({
  towerEventProp: { type: TowerEvent, required: true }
})
</script>

<template>
  <RouterLink :to="{ name: 'Event Details', params: { eventId: towerEventProp.id } }">
    <div class="card h-100">
      <img class="img-fluid position-relative rounded" :src="towerEventProp.coverImg" :alt="towerEventProp.type">
      <div class="position-absolute end-0 rounded event-type">
        <i v-if="towerEventProp.type === 'convention'" class="fa-solid fa-people-group"></i>
        <i v-if="towerEventProp.type === 'concert'" class="fa-solid fa-guitar"></i>
        <i v-if="towerEventProp.type === 'sport'" class="fa-regular fa-futbol"></i>
        <i v-if="towerEventProp.type === 'digital'" class="fa-solid fa-tv"></i>
      </div>
      <div class="card-body">
        <h5 class="card-title">{{ towerEventProp.name }}</h5>
        <h6 class="card-subtitle">Hosted by {{ towerEventProp.creator?.name }}</h6>
        <p>{{ towerEventProp.startDate.toLocaleDateString() }} - {{ towerEventProp.location }}<br>{{
          towerEventProp.capacity }} Spots</p>
      </div>
      <p v-if="towerEventProp.isCanceled" class="text-center bg-danger text-light">CANCELLED</p>
      <p v-if="towerEventProp.capacity - towerEventProp.ticketCount === 0" class="bg-primary text-center text-light">
        SOLD OUT</p>
    </div>
  </RouterLink>

</template>

<style lang="scss" scoped>
.event-type {
  background-color: lightblue;
  padding: 0 .3rem 0 .3rem;
}
</style>