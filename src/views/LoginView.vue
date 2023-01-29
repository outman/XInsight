<template>
  <div class="row">
    <div class="col-4 offset-4" id="board">
      <div class="main">
        <div class="col">
          <span class="title">X - Insight</span>
        </div>
        <div class="col">
          <label for="username" class="visually-hidden">Email</label>
          <input type="text" class="form-control-sm wh-200" id="username" placeholder="Username" v-model="form.username">
        </div>
        <div class="col">
          <label for="password" class="visually-hidden">Password</label>
          <input type="password" class="form-control-sm wh-200" id="password" placeholder="Password" v-model="form.password">
        </div>
        <div class="col">
          <button type="submit" class="btn btn-primary btn-sm mb-3 wh-200" @click="clickLogin">Login</button>
        </div>
      </div>
    </div>
  </div>
  <div class="toast-container position-fixed top-50 end-0 p-3">
    <div ref="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Warning</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        Something was broken, please reload page.
      </div>
    </div>
  </div>
</template>

<script setup>
import {userLogin} from "@/api/user";

import {reactive, ref} from "vue";
import {toastShowWarning} from "@/api/util";
import {useLoading} from "vue-loading-overlay";

const $loading = useLoading({
  loader: 'bars',
  color: '#712cf9',
  container: null,
  canCancel: false
})

const liveToast = ref(null)
let form = reactive({
  username: '',
  password: ''
})

const clickLogin = () => {
  let loader = $loading.show()
  userLogin({
    username: form.username,
    password: form.password
  }).then((response) => {
    if (response.statusCode === 200) {
      if (response.data.token && response.data.username) {
        localStorage.setItem('XINSIGHT-TOKEN', response.data.token)
        localStorage.setItem('XINSIGHT-USER', response.data.username)
        window.location.href = '/'
        return
      }
    }
    toastShowWarning(liveToast.value)
    console.log(response)
  }, (error) => {
    toastShowWarning(liveToast.value)
    console.log(error)
  }).finally(() => {
    loader.hide()
  })
}
</script>

<style scoped>
#board {
  display: flex;
  justify-content: center;
}

.wh-200 {
  width: 200px;
}

.title {
  color: #f2f2f2;
  font-weight: bold;
}
.main {
  align-content: center;
  padding: 40px 10px;
  background: linear-gradient( #712cf9, #8350c2);
  text-align: center;
  width: 260px;
}
.main .col {
  margin-top: 10px;
}
</style>
