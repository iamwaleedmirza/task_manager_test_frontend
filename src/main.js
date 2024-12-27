import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css"
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import BaseCard from "@/components/ui/BaseCard.vue";
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('base-card', BaseCard);

app.use(createPinia())
app.use(router)
app.mount('#app')
