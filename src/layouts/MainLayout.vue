<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-white text-grey-10" 
      bordered
    >
      <q-toolbar class="constrain">
        <q-btn 
          to="/camera" 
          class="large-screen-only q-mr-sm"
          icon="eva-camera-outline" 
          size="18px" 
          flat 
          round 
          dense />
        <q-separator class="large-screen-only" vertical spaced />
        <q-toolbar-title class="text-grand-hotal text-bold">
          Quasargram
        </q-toolbar-title>
        <q-btn 
          to="/" 
          class="large-screen-only"
          icon="eva-home-outline" 
          size="18px" 
          flat 
          round 
          dense />
      </q-toolbar>
    </q-header>

    <q-footer 
    class="bg-white" 
    bordered>
      <transition 
        appear 
        enter-active-class="animated fadeIn" 
        leave-active-class="animated fadeOut">
        <div class="banner-container bg-primary" v-if="showAppInstallBanner">
          <div class="constrain">
            <q-banner inline-actions class="bg-primary text-while" dense>
              <template v-slot:avatar>

                <q-avatar 
                  icon="eva-camera-outline" 
                  text-color="grey-10" 
                  color="white" 
                  font-size="22px"/>
              </template>
              <b>Install Quasargram?</b>
              <template v-slot:action>
                <q-btn flat class="q-px-sm" label="Yes" dense @click="installApp"/>
                <q-btn flat class="q-px-sm" label="Later" dense/>
                <q-btn flat class="q-px-sm" label="Never" dense @click="neverShowAppInstallBanner"/>
              </template>
            </q-banner>
          </div>
        </div>
      </transition> 
      <q-tabs class="text-grey-10 small-screen-only" active-color="primary" indicator-color="transparent">
        <q-route-tab to="/" icon="eva-home-outline" @click="showAppInstallBanner=false"/>
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <keep-alive :include="['PageHome']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
let deferredPrompt;

export default {
  name: 'MainLayout',
  data () {
    return {
      showAppInstallBanner: false
    }
  },
  methods:{
    installApp(){
      this.showAppInstallBanner = false;

      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if(choiceResult.outcome === 'accepted'){
          this.neverShowAppInstallBanner();
        }else{

        }
      })
    },
    neverShowAppInstallBanner(){
      this.showAppInstallBanner = false;
      this.$q.localStorage.set('neverShowAppInstallBanner',true);
    }
  },
  mounted(){
    let neverShowAppInstallBanner = this.$q.localStorage.getItem('neverShowAppInstallBanner')

    if(!neverShowAppInstallBanner)
    {
      window.addEventListener('beforeinstallprompt',(e) => {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(() => {
          this.showAppInstallBanner = true;
        },3000)
        
      })
    }
    
  }
}
</script>

<style lang="sass">
  .q-toolbar 
    @media (min-width: $breakpoint-sm-min)
      height: 77px
  .q-toolbar__title
    font-size: 30px
    @media (max-width: $breakpoint-xs-max)
      text-align: center
  .q-footer
    .q-tab__icon
      font-size: 30px

</style>