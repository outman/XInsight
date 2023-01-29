import { createApp } from 'vue'
import { LoadingPlugin } from 'vue-loading-overlay';
import App from './App.vue'
import router from './router'

import "bootstrap"
import 'vue-loading-overlay/dist/css/index.css'
import "bootstrap/dist/css/bootstrap.min.css"

const app = createApp(App)

app.use(router)
app.use(LoadingPlugin);

app.mount('#app')
