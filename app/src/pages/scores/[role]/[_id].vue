<template lang="pug">
div
    h1 Scores
    img(v-if="buzzedBy" :src="config.public.apiUrl + '/assets/images/burgers/lettre_' + buzzedBy + '.png'")
    div
      button(:disabled='scores.ketchup == 0' @click='changeScore("ketchup", -1)') -
      button(:disabled='scores.ketchup == 25' @click='changeScore("ketchup", 1)') +
      hr
      button(:disabled='scores.mayo == 0' @click='changeScore("mayo", -1)') -
      button(:disabled='scores.mayo == 25' @click='changeScore("mayo", 1)') +
    div
      img(:src="config.public.apiUrl + '/assets/images/scores/ketchup/KETCHUP_AVEC_CHIFFRES_' + `${scores.ketchup}`.padStart(2, '0') + '.png'")
      img(:src="config.public.apiUrl + '/assets/images/scores/mayo/MAYO_AVEC_CHIFFRES_' + `${scores.mayo}`.padStart(2, '0') + '.png'")
</template>

<script lang="ts">
export default {
  data: () => ({
    buzzedBy: null,
    scores: {
      ketchup: 0,
      mayo: 0,
    },
  }),
  setup() {
    definePageMeta({
      validate: async (route) => {
        return ['anim', 'grandmiam'].includes(route.params.role)
      }
    })
    const config = useRuntimeConfig()
    return {
      config,
    }
  },
  methods: {
    async changeScore(team: string, value: number) {
      if (['ketchup', 'mayo'].indexOf(team) === -1) {
        return
      }
      this.scores[team] += value
      if (this.scores[team] < 0) {
        this.scores[team] = 0
      }
      if (this.scores[team] > 25) {
        this.scores[team] = 25
      }
      try {
        await $fetch(
          `/scores/update/${team}/${this.$route.params._id}/${this.scores[team]}`,
          { baseURL: this.config.public.apiUrl },
        )
      } catch(e) {
        console.log(e)
      }
    },
  },
  mounted() {
    // @ts-ignore
    new OverlaySSE('/api/scores/evt/' + this.$route.params._id)
    const subscribe = ['bqt', 'scores', this.$route.params._id]
    document.addEventListener(subscribe.join(':'), (event: any) => {
      console.log(event)
      switch(event.detail.type) {
        case 'ketchup':
          this.scores.ketchup = event.detail.score
          break
        case 'mayo':
          this.scores.mayo = event.detail.score
          break
      }
    })

    // @ts-ignore
    new OverlaySSE('/api/buzzers/evt/' + this.$route.params._id)
    const subscribe2 = ['bqt', 'buzzers', this.$route.params._id]
    document.addEventListener(subscribe2.join(':'), (event) => {
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
