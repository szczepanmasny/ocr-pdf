import { createApp } from 'vue'
import App from './App.vue'
import { asset, ui, pdfjs } from './plugins'

const app = createApp(App)
app.use(ui)
app.use(asset)
app.use(pdfjs)
app.mount('#app')
