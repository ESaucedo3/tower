<script setup>
import { towerEventsService } from '@/services/TowerEventsService.js';
import { logger } from '@/utils/Logger.js';
import Pop from '@/utils/Pop.js';
import { Modal } from 'bootstrap';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const eventTypes = ['convention', 'concert', 'sport', 'digital'];

const towerEventData = ref({
  name: '',
  location: '',
  type: '',
  startDate: Date(),
  capacity: 1,
  coverImg: '',
  description: ''
})

async function towerEventCreateOrUpdate() {
  try {
    if (route.name === 'Home') {
      const createdTowerEvent = await towerEventsService.createTowerEvent(towerEventData.value);
      resetForm();
      Pop.toast('Tower Event Created', 'success', 'top');
      Modal.getOrCreateInstance('#tower-event-form').hide();
      router.push({ name: 'Event Details', params: { eventId: createdTowerEvent.id } });
    }
    else {
      await towerEventsService.updateTowerEvent(route.params.eventId, towerEventData.value);
      resetForm();
      Pop.toast('Tower Event Updated', 'success', 'top');
      Modal.getOrCreateInstance('#tower-event-form').hide();
    }
  }
  catch (e) {
    Pop.error(e);
    logger.log(e);
  }
}

function resetForm() {
  towerEventData.value = {
    name: '',
    location: '',
    type: '',
    startDate: Date(),
    capacity: 0,
    coverImg: '',
    description: ''
  }
}
</script>

<template>
  <section class="container">
    <h2 v-if="route.name === 'Home'">Create New Event</h2>
    <h2 v-else>Edit Event</h2>
    <form @submit.prevent="towerEventCreateOrUpdate()" class="row gy-2">
      <div class="col-md-5">
        <h3 class="text-center">Image Preview</h3>
        <img v-if="towerEventData.coverImg" :src="towerEventData.coverImg" class="img-fluid" alt="Event Image">
      </div>
      <div class="col-md-7">
        <div class="row">
          <div class="col-md-6">
            <label class="form-label" for="towerEventName">Event Name</label>
            <input v-model="towerEventData.name" class="form-control" id="towerEventName" name="towerEventName"
              placeholder="Name" minlength="3" maxlength="50" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="towerEventLocation">Event Location</label>
            <input v-model="towerEventData.location" class="form-control" id="towerEventLocation"
              name="towerEventLocation" placeholder="Location" maxlength="250" required>
          </div>
          <div class="col-12">
            <label class="form-label" for="towerEventType">Event Type</label>
            <select v-model="towerEventData.type" class="form-control" name="towerEventType" id="towerEventType">
              <option disabled selected value="">Select an event type</option>
              <option v-for="eventType in eventTypes" :key="eventType" :value="eventType">{{ eventType }}</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="towerEventDate">Start Date</label>
            <input v-model="towerEventData.startDate" class="form-control" type="date" id="towerEventDate"
              name="towerEventDate" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="towerEventCapacity">Capacity</label>
            <input min="1" max="5000" v-model="towerEventData.capacity" class="form-control" type="number"
              name="towerEventCapacity" id="towerEventCapacity" required>
          </div>
          <div class="col-12">
            <label class="form-label" for="towerEventImage">Image Url</label>
            <input v-model="towerEventData.coverImg" class="form-control" type="url" name="towerEventImage"
              id="towerEventImage" required>
          </div>
          <div class="col-12">
            <label class="form-label" for="towerEventDescription">Event Description</label>
            <textarea v-model="towerEventData.description" class="form-control" name="towerEventDescription"
              id="towerEventDescription" placeholder="Tell us more about your event..." rows="6" minlength="15"
              maxlength="1000" required></textarea>
          </div>
          <div class="col-12">
            <div class="text-end mt-2">
              <button v-if="route.name === 'Home'" class="btn btn-outline-dark rounded px-4">Create Event</button>
              <button v-else class="btn btn-outline-dark rounded px-4">Finish Editing Event</button>
            </div>
          </div>

        </div>
      </div>
    </form>
  </section>
</template>


<style lang="scss" scoped>
textarea {
  resize: none;
}
</style>