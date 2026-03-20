<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { themeStore } from '@/stores/theme'
import { getSettings } from '@/api/portfolio'

const { t, locale } = useI18n({ useScope: 'global' })
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const settings = ref(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleLanguage = () => {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const fetchSettings = async () => {
  try {
    settings.value = await getSettings()
  } catch (err) {
    console.error('Failed to fetch settings:', err)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchSettings()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navLinks = [
  { name: 'navbar.home', hash: '#home' },
  { name: 'navbar.services', hash: '#services' },
  { name: 'navbar.about', hash: '#about' },
  { name: 'navbar.projects', hash: '#projects' },
  { name: 'navbar.articles', hash: '#articles' },
  { name: 'navbar.contact', hash: '#contact' }
]
</script>

<template>
  <nav 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
      isScrolled ? 'bg-white/80 dark:bg-[#1a1c20]/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    ]"
  >
    <div class="container mx-auto grid grid-cols-3 items-center">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter no-underline group flex items-center gap-2 justify-self-start">
        <img v-if="settings?.logo_url" :src="settings.logo_url" alt="Logo" class="h-8 w-auto object-contain" />
        <span v-else>{{ settings?.site_name || 'Omar' }}<span class="text-primary group-hover:drop-shadow-[0_0_8px_#FF8C00] transition-all">.</span></span>
      </router-link>

      <!-- Desktop Nav Links -->
      <ul class="hidden lg:flex justify-center gap-6 list-none p-0 m-0 font-bold text-sm">
        <li v-for="link in navLinks" :key="link.hash">
          <a 
            :href="link.hash" 
            class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors no-underline whitespace-nowrap"
          >
            {{ t(link.name) }}
          </a>
        </li>
      </ul>

      <!-- Desktop Toggles -->
      <div class="hidden lg:flex items-center gap-3 justify-self-end">
        <!-- Language Toggle -->
        <button 
          @click="toggleLanguage"
          class="p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
          :title="t('accessibility.toggleLanguage')"
        >
          <span class="font-bold uppercase text-xs">{{ locale === 'ar' ? 'EN' : 'AR' }}</span>
        </button>

        <!-- Theme Toggle -->
        <button 
          @click="themeStore.toggleTheme"
          class="p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
          :title="t('accessibility.toggleTheme')"
        >
          <i :class="['fas', themeStore.isDark ? 'fa-sun' : 'fa-moon']"></i>
        </button>
      </div>

      <!-- Mobile Toggle -->
      <div class="flex lg:hidden items-center gap-4 justify-self-end">
        <button 
          @click="themeStore.toggleTheme"
          class="p-2 text-gray-600 dark:text-gray-300 bg-transparent border-none"
        >
          <i :class="['fas', themeStore.isDark ? 'fa-sun' : 'fa-moon']"></i>
        </button>
        
        <button 
          @click="toggleMenu"
          class="p-2 text-gray-600 dark:text-gray-300 bg-transparent border-none text-xl"
        >
          <i :class="['fas', isMenuOpen ? 'fa-times' : 'fa-bars']"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="isMenuOpen" 
        class="absolute top-full left-0 right-0 bg-white dark:bg-[#1a1c20] shadow-xl lg:hidden p-6 border-t border-gray-100 dark:border-gray-800"
      >
        <ul class="flex flex-col gap-4 list-none p-0 m-0 font-bold">
          <li v-for="link in navLinks" :key="link.hash">
            <a 
              :href="link.hash" 
              @click="isMenuOpen = false"
              class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors no-underline block py-2"
            >
              {{ t(link.name) }}
            </a>
          </li>
        </ul>
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <button 
            @click="toggleLanguage"
            class="font-bold text-sm text-primary bg-transparent border-none"
          >
            {{ locale === 'ar' ? 'English' : 'العربية' }}
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.text-primary { color: #FF8C00; }
</style>
