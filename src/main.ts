import { createApp } from 'vue'
import App from './app'
import { asset, ui, pdfjs } from './plugins'

const app = createApp(App)
app.use(ui)
app.use(asset)
app.use(pdfjs)
app.mount('#app')
