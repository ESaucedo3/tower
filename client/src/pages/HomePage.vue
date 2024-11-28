<script setup>
  import { AppState } from '@/AppState.js';
  import EventCard from '@/components/EventCard.vue';
  import { towerEventsService } from '@/services/TowerEventsService.js';
  import { logger } from '@/utils/Logger.js';
  import Pop from '@/utils/Pop.js';
  import { computed, onMounted, ref } from 'vue';

  const filterBy = ref('all');
  const account = computed(() => AppState.account);

  const towerEvents = computed(() => {
    if (filterBy.value === 'all') {
      return AppState.towerEvents
    }
    return AppState.towerEvents.filter(towerEvent => towerEvent.type === filterBy.value);
  });

  const filterTowerEvents = [
    { text: 'all', eventType: 'fa-solid fa-infinity' },
    { text: 'convention', eventType: 'fa-solid fa-people-group'},
    { text: 'concert', eventType: 'fa-solid fa-guitar'},
    { text: 'sport', eventType: 'fa-regular fa-futbol'},
    { text: 'digital', eventType: 'fa-solid fa-tv'},
  ]
  
  onMounted(() => getAllEvents());

  async function getAllEvents() {
    try {
      await towerEventsService.getAllEvents();
    }
    catch (e){
      Pop.error(e);
      logger.error(e);
    }
  }
</script>

<template>
  <!-- SECTION Hero -->
  <section class="container-fluid hero">
    <div class="row justify-content-center">
      <div class="col-11">
        <div class="row align-items-center hero-adjust">
          <div class="col-md-4">
            <div class="text-light mt-3">
              <h2><strong>Event management for people, <br>by people</strong></h2>
              <p class="hero-msg">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A possimus quidem expedita inventore in reiciendis aut iusto! Explicabo accusantium neque necessitatibus? Provident quae odit aperiam temporibus natus voluptas esse?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION Discover Events & Create Events -->
  <section class="container my-3">
    <h3 class="mb-2">How Tower Works</h3>
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="d-flex p-2 create-search-design h-100">
          <div class="me-2">
            <i class="fa-brands fa-searchengin fa-lg"></i>
          </div>
          <div>
            <h4>Discover events you're interested in</h4>
            <p class="m-0">Browse through community hosted events for all <br>the things you love</p>
          </div>
        </div>
      </div>
      <div class="col-md-5">
        <div class="d-flex p-2 create-search-design">
          <div class="me-2">
            <i class="fa-solid fa-plus fa-lg"></i>
          </div>
          <div>
            <h4>Start an event to invite your friends</h4>
            <p class="mb-2">Create your own Tower event, and draw from a <br>community of millions</p>
            <button v-if="account" class="create-btn" type="button" data-bs-toggle="modal" data-bs-target="#tower-event-form">Create an event</button>
          </div>
        </div>
      </div>
    </div>
   </section>

   <!-- SECTION Categories -->
   <section class="container mb-3">
    <h3>Explore top categories</h3>
    <div class="row justify-content-evenly gy-2">
      <div v-for="towerEvent in filterTowerEvents" :key="towerEvent.text" class="col-md-2">
        <button @click="filterBy = towerEvent.text" type="button" class="btn p-0 w-100 border-0 selectable filter-btn">
          <div class="d-flex flex-column justify-content-center text-center category-design">
            <i :class="towerEvent.eventType"></i>
            {{ towerEvent.text.charAt(0).toUpperCase() + towerEvent.text.slice(1) }}
          </div>
        </button>
      </div>
    </div>
   </section>

  <!-- SECTION Events -->
  <section class="container mb-3">
    <h3>Upcoming Events</h3>
    <div class="row justify-content-center">
      <div class="col-11">
        <div class="row g-3">
          <div v-for="towerEvent in towerEvents" :key="towerEvent.id" class="col-6 col-md-3 col-lg-4">
            <EventCard :towerEventProp="towerEvent" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .hero {
    background-image: url(https://c4.wallpaperflare.com/wallpaper/45/572/12/night-sky-space-stars-wallpaper-preview.jpg);
    background-size: cover;
    background-position: center;
  }

  .hero-adjust {
    min-height: 95dvh;
  }

  .hero-msg {
    line-height: 1.9rem;
  }

  .create-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: lightgreen;
  }

  .category-design {
    aspect-ratio: 1/1;
    height: 6rem;
    margin: 0 auto;
  }

  .filter-btn {
    background-color: rgb(48 45 45/40%);
  }

  .create-search-design {
    background-color: rgb(48 45 45/20%);
  }
</style>
