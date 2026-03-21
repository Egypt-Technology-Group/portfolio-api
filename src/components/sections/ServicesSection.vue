<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getServices } from '@/api/portfolio'

const { t, locale } = useI18n({ useScope: 'global' })

const services = ref([])
const loading = ref(true)
const error = ref(null)

const fetchServices = async () => {
  try {
    loading.value = true
    services.value = await getServices()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchServices)
</script>

<template>
  <section id="services" class="w-full bg-[#fafafa] dark:bg-[#1a1c20] py-20 px-4 transition-colors duration-500 scroll-mt-20">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-black text-gray-900 dark:text-white mb-2 relative inline-block transition-colors">
        {{ t('services.title') }}
        <div class="w-full h-1.5 absolute -bottom-2 right-0 rounded-full shadow-lg shadow-primary/30 bg-primary"></div>
      </h2>
      <p class="text-gray-500 dark:text-gray-400 font-bold text-sm mt-8">
        {{ t('services.subtitle') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p class="text-gray-500 font-bold">{{ t('common.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-500 font-bold mb-4">{{ error }}</p>
      <button @click="fetchServices" class="px-6 py-2 bg-primary text-white rounded-lg font-bold">
        {{ t('common.retry') }}
      </button>
    </div>

    <div v-else class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <article
        v-for="service in services"
        :key="service.id"
        class="bg-white dark:bg-[#24262b] p-8 rounded-[40px] shadow-xl shadow-black/5 border border-gray-50 dark:border-white/5 flex flex-col items-center text-center group transition-all duration-500 hover:-translate-y-2 hover:border-primary/30"
      >
        <div class="text-6xl mb-6 h-20 flex items-center justify-center text-primary drop-shadow-lg transition-transform group-hover:scale-110">
          <!-- Use SVG path if available -->
          <svg v-if="service.svg_path" :viewBox="service.svg_viewbox || '0 0 24 24'" 
               class="w-16 h-16" 
               style="fill: #FF8C00;">
            <path :d="service.svg_path"></path>
          </svg>
          <!-- Fallback to icon URL if path not available -->
          <img v-else-if="service.icon" :src="service.icon" :alt="service.title_en" class="w-16 h-16 object-contain" />
          <!-- Fallback to Font Awesome for backward compatibility -->
          <i v-else :class="service.icon || 'fa-code'" class="fas"></i>
        </div>
        <div class="mb-4 w-full">
          <h3 class="text-xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
            {{ locale === 'ar' ? service.title_ar : service.title_en }}
          </h3>
          <div class="w-16 h-0.5 mx-auto opacity-20 group-hover:w-24 transition-all duration-500 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
          {{ locale === 'ar' ? service.description_ar : service.description_en }}
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.text-primary { color: #FF8C00; }
.bg-primary { background-color: #FF8C00; }
.shadow-primary { --tw-shadow-color: #FF8C00; }
</style>
