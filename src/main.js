import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VueI18n from 'vue-i18n'
import messages from './i18n/messages'
import App from './App'
import 'font-awesome/css/font-awesome.css'
import './assets/stylesheets/site.scss'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.use(VueCookie)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages
})

new Vue({
  render: h => h(App),
  i18n
}).$mount('#app')
