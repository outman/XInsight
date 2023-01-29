<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {onMounted, ref} from "vue";
import Logo from "@/components/icons/IconLogo.vue";

const route = useRoute()
const router = useRouter()

let username = ref('')
let currentRouteName = ref('')
onMounted(async () => {
  username.value = localStorage.getItem('XINSIGHT-USER')
  await router.isReady()
  currentRouteName.value = route.name
})

let logout = () => {
  localStorage.setItem('XINSIGHT-USER', '');
  localStorage.setItem('XINSIGHT-TOKEN', '');
  window.location.href = '/login'
  return;
}

</script>
<template>
  <div>
    <nav v-if="currentRouteName !== 'login'" class="navbar navbar-expand-lg bd-navbar fixed-top" style="background-color: #712cf9; height: 64px;"  v-cloak>
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand text-white">
          <logo></logo>
          <span>X-Insight</span>
        </router-link>
        <ul class="navbar-nav mb-2 mb-lg-0 me-5">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="user">{{username}}</span>
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" @click="logout">Logout</a></li>
          </ul>
        </li>
        </ul>
      </div>
    </nav>
    <main class="container-fluid mt-lg-auto">
      <RouterView />
    </main>
    <footer>
      <div class="container-fluid">
        <div class="text-center space">
          <a href="https://github.com/outman/XInsight" target="_blank" class="project-link">&copy; X - Insight </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
span.user {
  color: white;
}
.project-link {
  text-decoration: none;
}
div.space {
  margin: 10px 0;
}
</style>
