<script setup>
import { computed, onMounted } from 'vue';
import { AppState } from '../AppState.js';
import Pop from '@/utils/Pop.js';
import { logger } from '@/utils/Logger.js';
import { ticketsService } from '@/services/TicketsService.js';

const account = computed(() => AppState.account);
const attendingEvents = computed(() => AppState.eventTickets);

onMounted(() => {
  getAccountAttendingEvents();
})

async function getAccountAttendingEvents() {
  try {
    await ticketsService.getAccountAttendingEvents();
  }
  catch (e){
    Pop.error(e);
    logger.log(e);
  }
}

async function deleteTicket(ticketId) {
  try {
    const confirmed = await Pop.confirm('Are you sure you no longer want to attend');
    if (!confirmed) return;
    await ticketsService.deleteTicket(ticketId);
    Pop.toast('Ticket removed', 'success');
  }
  catch (e){
    Pop.error(e);
    logger.log(e)
  }
}

</script>

<template>
  <section class="container">
    <div v-if="account">
      <div class="row account-contain align-items-center">
        <div class="col-12">
          <div class="d-flex align-items-center">
            <img class="account-img me-3" :src="account.picture" alt="Your account">
            <p><span class="fs-2">{{ account.name }}</span><br>{{ attendingEvents.length }} {{ attendingEvents.length == 1 ? 'ticket' : 'tickets' }}</p>
          </div>
        </div>
      </div>

      <div class="row justify-content-center mb-2">
        <div class="col-11">
          <h3>Upcoming Events</h3>
          <div class="row">
            <div v-for="attendingEvent in attendingEvents" :key="attendingEvent.id" class="col-md-4">
              <div class="card mb-3">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img :src="attendingEvent.towerEvent.coverImg" class="upcoming-event-img img-fluid rounded-start" :alt="attendingEvent.towerEvent.name">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ attendingEvent.towerEvent.name }}</h5>
                      <p class="car-subtitle">{{ attendingEvent.towerEvent.updatedAt.toLocaleDateString() }}</p>
                      <p>{{ attendingEvent.towerEvent.capacity }} spots</p>
                      <div class="text-end">
                        <button @click="deleteTicket(attendingEvent.id)" class="btn btn-outline-dark rounded px-2 py-1" type="button">Unattend</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h1>Loading... <i class="mdi mdi-loading mdi-spin"></i></h1>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .account-img {
    aspect-ratio: 1/1;
    border-radius: 50%;
    height: 11dvh;
  }

  .account-contain {
    min-height: 20dvh;
  }

  .upcoming-event-img {
    height: 100%;
    object-fit: cover;
  }
</style>
