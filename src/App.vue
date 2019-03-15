<template>
  <div id="app">
    <h1>Pixels Drawing</h1>
    <div class="languages">
      <i class="fa fa-globe"></i>
      <span @click="switchLanguage(lang)" v-for="(lang, index) in Object.keys($i18n.messages)" :key="index" :class="[lang === currentLanguage ? 'active' : '']">{{ lang }}</span>
    </div>
    <Home/>
    <div class="footer">
      <div><a href="https://thewebsdoor.com" target="_blank">The Web's Door</a></div>
      <div><a href="https://github.com/TheWebsDoor/PixelsDrawing" target="_blank"><i class="fa fa-github"></i> Github</a></div>
    </div>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'app',
  components: {
    Home
  },
  data () {
    return {
      currentLanguage: 'en'
    }
  },
  methods: {
    switchLanguage (lang) {
      this.currentLanguage = lang
      this.$i18n.locale = lang
      this.$cookie.set('currentLanguage', lang, { expires: '1Y' })
    }
  },
  mounted () {
    if (!this.$cookie.get('currentLanguage')) {
      this.$cookie.set('currentLanguage', this.$i18n.locale, { expires: '1Y' })
    }
    this.currentLanguage = this.$cookie.get('currentLanguage')
    this.$i18n.locale = this.currentLanguage
  }
}
</script>

<style lang="scss">
@import './assets/stylesheets/variables';

.languages {
  margin-bottom: 5px;

  i.fa.fa-globe,
  span {
    color: $turquoise;
  }
  span {
    opacity: 0.6;
    text-transform: uppercase;
    margin-right: 5px;
    transition: .3s all;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }
    &.active {
      color: $greenSea;
      opacity: 1;
      font-weight: bold;
    }
  }
}
</style>
