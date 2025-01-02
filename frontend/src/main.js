import '@/assets/main.css';
import 'primeicons/primeicons.css';
import 'vue-toastification/dist/index.css';
import toast from 'vue-toastification';
import router from './router';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(router);
app.use(toast);
app.mount('#app');