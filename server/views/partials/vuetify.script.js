import 

const app = Vue.createApp({
  setup() {
    return {}
  },
  methods: window.methods,
})

const { createVuetify } = Vuetify
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#E53935',
          secondary: '#FFCDD2',
        },
      },
    },
  },
})

app.use(vuetify)

app.component('burger', require('../components/burger.vue').default)

app.mount('#v-app')
window.app = app
