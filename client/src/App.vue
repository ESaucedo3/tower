<script setup>
  import ModalWrapper from './components/ModalWrapper.vue';
  import Navbar from './components/Navbar.vue';
  import TowerEventForm from './components/TowerEventForm.vue';

</script>

<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
  </main>
  <ModalWrapper id="tower-event-form">
    <TowerEventForm />
  </ModalWrapper>
</template>

<style lang="scss">
@import '@/assets/scss/main.scss';
:root {
  --main-height: calc(100vh - 32px - 64px);
}
</style>
