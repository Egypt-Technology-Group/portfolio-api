<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import siteConfig from '@/config/site'
import { getHero, getSettings, getAbout } from '@/api/portfolio'

const { t, locale } = useI18n({ useScope: 'global' })

const heroData = ref(null)
const settings = ref(null)
const aboutData = ref(null)
const loading = ref(true)
const error = ref(null)

const currentText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
let timer = null

const roles = computed(() => {
  if (!heroData.value) return []
  return locale.value === 'ar' ? heroData.value.roles_ar : heroData.value.roles_en
})

let typingSpeed = 100
let deletingSpeed = 50
let pauseTime = 2000

const typeWriter = () => {
  const currentRoles = roles.value
  if (!currentRoles || currentRoles.length === 0) return
  
  const current = currentRoles[currentIndex.value]

  if (isDeleting.value) {
    currentText.value = current.substring(0, currentText.value.length - 1)
  } else {
    currentText.value = current.substring(0, currentText.value.length + 1)
  }

  let nextSpeed = isDeleting.value ? deletingSpeed : typingSpeed

  if (!isDeleting.value && currentText.value === current) {
    isDeleting.value = true
    nextSpeed = pauseTime
  } else if (isDeleting.value && currentText.value === '') {
    isDeleting.value = false
    currentIndex.value = (currentIndex.value + 1) % currentRoles.length
    nextSpeed = 500
  }

  timer = setTimeout(typeWriter, nextSpeed)
}

const fetchData = async () => {
  try {
    loading.value = true
    const [hero, siteSettings, about] = await Promise.all([
      getHero(), 
      getSettings(),
      getAbout()
    ])
    heroData.value = hero
    settings.value = siteSettings
    aboutData.value = about
    // Start typewriter after data loads
    typeWriter()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Restart typewriter when roles change (language change)
watch(roles, (newRoles) => {
  if (timer) clearTimeout(timer)
  currentText.value = ''
  currentIndex.value = 0
  isDeleting.value = false
  if (newRoles.length > 0) {
    typeWriter()
  }
}, { deep: true })

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <section id="home" class="min-h-screen relative flex flex-col-reverse xl:flex-row items-center justify-start xl:justify-center pt-12 xl:pt-0 overflow-hidden">
    <div class="absolute inset-0 z-0 pointer-events-none">
      <svg viewBox="0 0 1440 800" fill="none" class="absolute w-full h-full">
        <path d="M1440 0 C1200 100, 800 200, 0 250" stroke="#FF8C00" stroke-width="4" stroke-opacity="0.15" opacity="1" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path>
        <path d="M1440 50 C1100 150, 700 300, 0 400" stroke="#FF8C00" stroke-width="4" stroke-opacity="0.15" opacity="1" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path>
        <path d="M1440 100 C1000 200, 600 400, 0 550" stroke="#FF8C00" stroke-width="4" stroke-opacity="0.15" opacity="1" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path>
        <path d="M1440 150 C900 250, 500 500, 0 700" stroke="#FF8C00" stroke-width="4" stroke-opacity="0.15" opacity="1" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path>
        <path d="M1440 200 C800 300, 400 600, 0 850" stroke="#FF8C00" stroke-width="4" stroke-opacity="0.15" opacity="1" pathLength="1" stroke-dashoffset="0px" stroke-dasharray="1px 1px"></path>
      </svg>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 w-full z-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
    </div>

    <div v-else-if="heroData" class="container mx-auto px-4 z-20 relative flex flex-col items-center xl:items-start text-center xl:text-start justify-center flex-1">
      <div class="mb-2">
        <h2 class="text-lg xl:text-2xl text-gray-600 dark:text-gray-400 mb-1 font-bold">
          {{ locale === 'ar' ? heroData.greeting_ar : heroData.greeting_en }}
        </h2>
        <h2 class="text-4xl xl:text-6xl font-black text-gray-800 dark:text-white leading-tight">
          {{ locale === 'ar' ? heroData.name_prefix_ar : heroData.name_prefix_en }} <span class="text-primary">{{ locale === 'ar' ? heroData.name_ar : heroData.name_en }}</span>
        </h2>
      </div>
      <div class="mb-4 h-[40px] flex items-center justify-center xl:justify-start w-full">
        <h3 class="text-xl xl:text-3xl font-bold inline-flex items-center text-primary">
          {{ currentText }}
          <span class="w-[3px] h-[25px] mx-1 animate-pulse bg-primary"></span>
        </h3>
      </div>
      <p class="max-w-sm xl:max-w-xl mb-6 xl:mb-10 text-gray-600 dark:text-gray-400 font-bold text-sm xl:text-lg leading-relaxed">
        {{ locale === 'ar' ? heroData.description_ar : heroData.description_en }}
      </p>
      
      <!-- Social Links -->
      <div v-if="settings" class="flex gap-2 justify-center xl:justify-start w-full mb-8">
        <a v-if="settings.facebook_url" :href="settings.facebook_url" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center text-white rounded-xl hover:scale-110 transition-all bg-[#1877F2]">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a v-if="settings.linkedin_url" :href="settings.linkedin_url" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center text-white rounded-xl hover:scale-110 transition-all bg-[#0A66C2]">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a v-if="settings.telegram_url" :href="settings.telegram_url" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center text-white rounded-xl hover:scale-110 transition-all bg-[#24A1DE]">
          <i class="fab fa-telegram-plane"></i>
        </a>
        <a v-if="settings.twitter_url" :href="settings.twitter_url" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center text-white rounded-xl hover:scale-110 transition-all bg-black dark:bg-white/10">
          <i class="fab fa-x-twitter"></i>
        </a>
        <a v-if="settings.instagram_url" :href="settings.instagram_url" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center text-white rounded-xl hover:scale-110 transition-all bg-gradient-to-tr from-[#fdf497] via-[#fd5949] to-[#d6249f]">
          <i class="fab fa-instagram"></i>
        </a>
        <a v-if="settings.contact_whatsapp" :href="`https://wa.me/${settings.contact_whatsapp}`" target="_blank" rel="noopener noreferrer" class="w-9 h-9 flex items-center justify-center text-white rounded-xl hover:scale-110 transition-all bg-[#25D366]">
          <i class="fab fa-whatsapp"></i>
        </a>
      </div>

      <div class="flex flex-row gap-4 justify-center xl:justify-start items-center w-full px-2">
        <a href="#contact" class="group flex items-center justify-center gap-2 px-6 h-[48px] bg-primary text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95">
          <span>{{ t('hero.ctaWork') }}</span>
        </a>
        <a v-if="aboutData?.resume_url" :href="aboutData.resume_url" download class="group flex items-center justify-center gap-2 px-6 h-[48px] border-2 border-primary text-primary font-bold rounded-xl transition-all hover:bg-primary hover:text-white active:scale-95">
          <span>{{ t('hero.ctaResume') }}</span>
        </a>
      </div>
    </div>

    <div v-if="heroData" class="relative z-10 w-[240px] h-[240px] md:w-[350px] md:h-[350px] xl:w-[500px] xl:h-[500px] flex justify-center items-center mt-10 mb-6 xl:mt-0 xl:mb-0">
      <div class="absolute inset-0 bg-primary/20 blur-[80px] rounded-full z-0"></div>
      <div class="relative flex justify-center items-center w-full h-full pointer-events-none select-none overflow-hidden">
        <img v-if="heroData.image_url" alt="Omar Algamel" :src="heroData.image_url" class="object-contain w-full h-full mx-auto" />
        <img v-else alt="Omar Algamel" src="@/assets/karimgamal.avif" class="object-contain w-full h-full mx-auto" />
      </div>
    </div>
  </section>
</template>



<style scoped>
.text-primary { color: #FF8C00; }
.bg-primary { background-color: #FF8C00; }
.border-primary { border-color: #FF8C00; }
</style>
