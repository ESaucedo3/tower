<script setup>
  import { AppState } from '@/AppState.js';
  import { ticketsService } from '@/services/TicketsService.js';
  import { towerCommentsService } from '@/services/TowerCommentsService.js';
  import { towerEventsService } from '@/services/TowerEventsService.js';
  import Pop from '@/utils/Pop.js';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const activeTowerEvent = computed(() => AppState.activeTowerEvent);
  const eventAttendees = computed(() => AppState.profileTickets);
  const profileComments = computed(() => AppState.profileComments);
  const account = computed(() => AppState.account);

  const editableCommentData = ref({
    body: '',
    eventId: route.params.eventId,
  })
  
  const alreadyHaveTicket = computed(() => {
    const attending = AppState.profileTickets.find(profile => profile.accountId === AppState.account?.id);
    if (!attending) return false;
    return true;
  });
  
  watch(() => route.params.eventId, () => {
    getTowerEventById();
    getEventAttendees();
    getProfileComments();
  }, { immediate: true })
  
  async function getTowerEventById() {
    try {
      await towerEventsService.getTowerEventById(route.params.eventId);
    } 
    catch (e) {
      Pop.error(e);
    }
  }
  
  async function createTicket() {
    try {
      const ticketData = {
        eventId: route.params.eventId
      };
      await ticketsService.createTicket(ticketData);
    }
    catch (error){
      Pop.error(error);
    }
  }

  async function createComment() {
    try {
      await towerCommentsService.createComment(editableCommentData.value);
      editableCommentData.value = {
        body: '',
        eventId: route.params.eventId,
      }
    }
    catch (error){
      Pop.error(error);
    }
  }
  
  async function getEventAttendees() {
    try {
      await ticketsService.getEventAttendees(route.params.eventId);
    }
    catch (error){
      Pop.error(error);
    }
  }

  async function getProfileComments() {
    try {
      await towerCommentsService.getProfileComments(route.params.eventId);
    } catch (e) {
      Pop.error(e);
    }
  }

  async function cancelEvent() {
    try {
      const confirmed = await Pop.confirm('You sure you want to cancel the event?');
      if (!confirmed) return
      await towerEventsService.cancelEvent(route.params.eventId);
      Pop.toast('Event Cancelled', 'success');
    }
    catch (e) {
      Pop.error(e);
    }
  }

  async function deleteComment(commentId) {
    try {
      const confirmed = await Pop.confirm('Want to delete your comment?');
      if (!confirmed) return
      await towerCommentsService.deleteComment(commentId);
      Pop.toast('Successfully deleted comment!', 'success', 'top');
    }
    catch (error){
      Pop.error(error);
    }
  }

</script>

<template>
  <section class="container my-2">
    <!-- SECTION Event Image  -->
    <section v-if="activeTowerEvent" class="row hero-design mb-2" :style="{backgroundImage: `url(${activeTowerEvent.coverImg})`}">
      <div class="blurred-background"></div>
      <div class="col-12">
        <div class="d-flex justify-content-center">
          <img class="img-fluid hero-img" :src="activeTowerEvent.coverImg" :alt="activeTowerEvent.type">
        </div>
      </div>
    </section>


    <!-- SECTION Event Details -->
    <section v-if="activeTowerEvent" class="row g-2">
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-10 p-0">
            <div class="d-flex mb-3">
              <h2 class="fw-bold me-2">{{ activeTowerEvent.name }}</h2>
              <p class="p-1 m-0 align-self-center bg-info rounded-pill px-2">{{ activeTowerEvent.type }}</p>
              <p v-if="activeTowerEvent.isCanceled" class="m-0 align-self-center px-3 bg-danger text-light">CANCELLED</p>
              <div v-if="!activeTowerEvent.isCanceled">
                <div v-if="account?.id === activeTowerEvent.creatorId" class="ms-auto dropdown-center">
                  <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ...
                  </button>
                  <ul class="dropdown-menu">
                    <li><button class="dropdown-item text-center" type="button" data-bs-toggle="modal" data-bs-target="#tower-event-form">Edit <i class="fa-solid fa-pen fa-lg" style="color: #74C0FC;"></i></button></li>
                    <li><button class="dropdown-item text-center" @click="cancelEvent()" type="button">Cancel<i class="fa-solid fa-trash fa-lg" style="color: #ff0000;"></i></button></li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <p>{{ activeTowerEvent.description }}</p>
              <h5>Date & Time</h5>
              <p><i class="fa-solid fa-calendar-days me-3"></i>Starts {{ activeTowerEvent.startDate.toLocaleDateString() }}</p>
              <h5>Location</h5>
              <p><i class="fa-solid fa-location-dot me-3"></i>{{ activeTowerEvent.location }}</p>
            </div>
            <h5 class="fw-bold">See what folks are saying...</h5>
            <div class="design p-2">
              <p class="text-end text-success fw-bold">Join the conversation</p>
              <form @submit.prevent="createComment()">
                <textarea v-model="editableCommentData.body" class="form-control w-100" rows="5" placeholder="Tell the people"></textarea>
                <div class="text-end my-2">
                  <button :disabled="account === null" class="btn btn-success rounded py-1 px-2">Post Comment</button>
                </div>
              </form>
            
              <div v-for="profileComment in profileComments" :key="profileComment.id" class="d-flex comment-design p-1 mb-2 shadow-sm">
                <img class="commenter me-2 mt-2" :src="profileComment.creator.picture" :alt="profileComment.creator.name">
                <div class="w-100">
                  <p class="m-0">{{ profileComment.creator.name }}</p>
                  <p>{{ profileComment.body }}</p>
                  <div v-if="account?.id === profileComment.creatorId" class="text-end">
                    <button @click="deleteComment(profileComment.id)" class="btn btn-danger rounded p-0 px-2" type="button">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- NOTE Attend & Attendees -->
      <div class="col-md-3 p-0 mt-2">
        <div v-if="AppState.account">
          <div v-if="!activeTowerEvent.isCanceled" class="p-2 design text-center">
            <p class="m-0">{{ alreadyHaveTicket ? 'You are attending this event' : 'Interested? Grab a ticket!' }}</p>
            <div class="mb-2">
              <button v-if="!alreadyHaveTicket" :disabled="activeTowerEvent.capacity - activeTowerEvent.ticketCount === 0" @click="createTicket()" type="button" class="btn btn-outline-dark rounded w-50">Attend</button>
            </div>
            <p v-if="activeTowerEvent.capacity - activeTowerEvent.ticketCount !== 0" class="text-end m-0 mt-1 mb-3">{{ activeTowerEvent.capacity - activeTowerEvent.ticketCount }} spots left</p>
            <p v-else class="text-end">SOLD OUT</p>
          </div>
          <div v-else class="p-2 bg-info text-center">
            <p>Event has been cancelled</p>
          </div>
        </div>
        <div v-else>
          <p class="text-center text-light p-2 bg-dark">You must be logged in. In order to attend to this event</p>
        </div>
  
        <div v-if="eventAttendees.length > 0" class="p-2 design mt-3">
          <p class="m-0 mb-2">Attendees</p>
          <div class="px-1">
            <p v-for="attendee in eventAttendees" :key="attendee.profile.id" class="border-start border-2 border-dark mb-2"><img class="attendee-img mx-2" :src="attendee.profile.picture" :alt="`${attendee.profile.name}'s picture'`">{{ attendee.profile.name }}</p>
          </div>
          <p class="text-end m-0">{{ eventAttendees.length >= 6 ? 'Show More ⌄' : '' }}</p>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
  .hero-design {
    position: relative;
    background-size: cover;
    background-position: center;

    & .blurred-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.5);
      z-index: 1;
    }

    & .hero-img {
      aspect-ratio: 16/9;
      height: 49dvh;
      position: relative;
      z-index: 2;
    }
  }

  .attendee-img {
    aspect-ratio: 1/1;
    height: 3dvh;
    border-radius: 50%;
  }

  .commenter {
    aspect-ratio: 1/1;
    height: 5dvh;
    border-radius: 50%;
  }

  textarea {
    resize: none;
  }

  .design {
    background-color: rgb(48 45 45/20%);
  }

  .comment-design {
    background-color: #ffffff;
  }
</style>