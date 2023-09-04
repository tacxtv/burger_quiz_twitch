<template lang="pug">
div
    h1 Buzzers
    img(:src="config.public.apiUrl + '/assets/images/burgers/BUZZERS_'+ this.$route.params.sauce.toUpperCase() + '.png'")
    img(v-if='buzzedBy' :src="config.public.apiUrl + '/assets/images/burgers/lettre_' + buzzedBy + '.png'")
    p
      span sauce:
      span(v-text='$route.params.sauce')
      button(@click='buzz' :disabled='buzzed')
        img(v-if='buzzed' :src="config.public.apiUrl + '/assets/images/burgers/CHEEZEBUZZER_BUZZACTIF.png'")
        img(v-else :src="config.public.apiUrl + '/assets/images/burgers/CHEEZEBUZZER_NORMAL.png'")
</template>

<script lang="ts">
export default {
  data: () => ({
    buzzed: false,
    buzzedBy: null,
  }),
  setup() {
    // @ts-ignore
    definePageMeta({
      validate: async (route) => {
        return ['mayo', 'ketchup'].includes(route.params.sauce)
      }
    })
    const config = useRuntimeConfig()
    return {
      config,
    }
  },
  methods: {
    async buzz() {
      try {
        // @ts-ignore
        const data = (await $fetch(
          `/api/buzzers/buzz/${this.$route.params.sauce}/${this.$route.params._id}`,
          { baseURL: this.config.public.apiUrl },
        )) as any
        this.buzzed = !this.buzzed
        setTimeout(() => {
          this.buzzed = !this.buzzed
        }, data.unlock - Date.now())
      } catch(e) {
        console.log(e)
      }
    },
  },
  mounted() {
    // @ts-ignore
    new OverlaySSE('/api/buzzers/evt/' + this.$route.params._id)
    const subscribe = ['bqt', 'buzzers', this.$route.params._id]
    document.addEventListener(subscribe.join(':'), (event: any) => {
      console.log(event)
      switch(event.detail.type) {
        case 'ketchup':
          this.buzzedBy = 'K'
          new Audio('/assets/audio/BUZ_KETCHUP.mp3').play()
          break
        case 'mayo':
          this.buzzedBy = 'M'
          new Audio('/assets/audio/BUZ_MAYO.mp3').play()
          break
      }

      setTimeout(() => {
        this.buzzedBy = null
      }, 5000)
    })
  }
}
</script>
