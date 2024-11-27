<script setup>
  import Login from './Login.vue';

</script>

<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark px-3">
    <router-link class="navbar-brand d-flex" :to="{ name: 'Home' }">
      <div class="d-flex align-items-center">
        <img class="img-fluid me-2" src="https://images.unsplash.com/photo-1547120692-e17787650e71?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9uZG9uJTIwdG93ZXJ8ZW58MHx8MHx8fDA%3D" alt="Tower">
        <h4>Tower</h4>
      </div>
    </router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
      aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto">
        <li>
          <RouterLink :to="{ name: 'Home' }" class="btn text-success lighten-30 selectable text-uppercase">
            Home
          </RouterLink>
        </li>
      </ul>
      <!-- LOGIN COMPONENT HERE -->
      <Login />
    </div>
  </nav>
</template>

<style scoped>
a:hover {
  text-decoration: none;
}

.nav-link {
  text-transform: uppercase;
}

.navbar-nav .router-link-exact-active {
  border-bottom: 2px solid var(--bs-success);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

@media screen and (min-width: 576px) {
  nav {
    height: 64px;
  }
}

img {
  aspect-ratio: 1/1;
  border-radius: 50%;
  height: 6dvh;
}
</style>
