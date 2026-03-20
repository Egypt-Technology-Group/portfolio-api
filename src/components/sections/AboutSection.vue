<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAbout } from '@/api/portfolio'

const { t, locale } = useI18n({ useScope: 'global' })

const aboutData = ref(null)
const loading = ref(true)
const error = ref(null)

const activeTab = ref('info')
const tabs = computed(() => [
  { id: 'info', label: t('about.tabs.info') },
  { id: 'skills', label: t('about.tabs.skills') },
  { id: 'experience', label: t('about.tabs.experience') },
  { id: 'education', label: t('about.tabs.education') }
])

const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const fetchAboutData = async () => {
  try {
    loading.value = true
    aboutData.value = await getAbout()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchAboutData)
</script>

<template>
  <section id="about" class="min-h-screen bg-gray-50 dark:bg-[#1a1c20] py-24 px-4 transition-colors duration-500 scroll-mt-20">
    <div class="container mx-auto max-w-7xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-500 font-bold">{{ t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 font-bold mb-4">{{ error }}</p>
        <button @click="fetchAboutData" class="px-6 py-2 bg-primary text-white rounded-lg font-bold">
          {{ t('common.retry') }}
        </button>
      </div>

      <!-- Content Area -->
      <div v-else-if="aboutData" class="flex flex-col xl:flex-row gap-16 items-start">
        <!-- Sticky Sidebar -->
        <div class="flex-1 w-full xl:sticky xl:top-32 text-center xl:text-start">
          <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-10">
            {{ t('about.title') }} <span class="text-primary">{{ t('about.subtitle') }}</span>
          </h2>
          <div class="relative w-full max-w-[400px] aspect-[4/5] rounded-[3rem] overflow-hidden bg-white dark:bg-[#24262b] shadow-2xl mx-auto xl:mx-0 group border-4 border-white dark:border-white/5">
            <img 
              v-if="aboutData.image_url"
              alt="Omar Algamel" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              :src="aboutData.image_url"
            >
            <img 
              v-else
              alt="Omar Algamel" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="@/assets/karimgamal.avif"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-[1.5] w-full">
          <!-- Tabs Navigation -->
          <div class="flex p-1.5 bg-gray-200/50 dark:bg-white/5 rounded-3xl mb-12 border border-gray-100 dark:border-white/5 shadow-inner">
            <button 
              v-for="tab in tabs" 
              :key="tab.id" 
              @click="setActiveTab(tab.id)" 
              :class="[
                'flex-1 py-4 text-sm md:text-base font-bold rounded-2xl transition-all duration-300',
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Panels -->
          <div class="min-h-[500px]">
            <!-- Info Tab -->
            <transition name="fade" mode="out-in">
              <div v-if="activeTab === 'info'" class="space-y-8">
                <div class="bg-white dark:bg-[#24262b] p-8 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-white/5">
                  <p class="text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                    {{ t('hero.description') }}
                  </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="info in aboutData.personalInfo" 
                    :key="info.label" 
                    class="flex items-center gap-5 p-5 bg-white dark:bg-[#24262b] rounded-3xl shadow-sm border border-gray-50 dark:border-white/5 transition-all hover:shadow-md hover:-translate-y-1"
                  >
                    <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl">
                      <i :class="info.icon"></i>
                    </div>
                    <div>
                      <span class="block text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">
                        {{ locale === 'ar' ? info.label : info.label_en }}
                      </span>
                      <span class="text-base font-bold text-gray-900 dark:text-white">
                        {{ locale === 'ar' ? info.value : (info.value_en || info.value) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skills Tab -->
              <div v-else-if="activeTab === 'skills'" class="space-y-12">
                <div v-for="section in aboutData.skillSections" :key="section.id">
                  <h4 class="text-primary font-black mb-8 flex items-center gap-3 text-2xl">
                    <i :class="section.icon"></i>
                    {{ locale === 'ar' ? section.title : section.title_en }}
                  </h4>
                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <div 
                      v-for="skill in section.items" 
                      :key="skill.name" 
                      class="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#24262b] rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-white/5 group transition-all hover:shadow-xl hover:-translate-y-2"
                    >
                      <i :class="[skill.icon, 'text-4xl md:text-5xl mb-4 transition-all duration-300']" :style="{ color: skill.color }"></i>
                      <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ skill.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Experience Tab -->
              <div v-else-if="activeTab === 'experience'" class="space-y-6">
                <div 
                  v-for="exp in aboutData.experiences" 
                  :key="exp.title" 
                  class="bg-white dark:bg-[#24262b] p-8 rounded-[2.5rem] border-l-4 md:border-l-0 md:border-r-4 border-primary shadow-sm transition-all hover:shadow-xl hover:translate-x-2"
                >
                  <h4 class="font-black text-2xl mb-4 text-gray-900 dark:text-white">
                    {{ locale === 'ar' ? exp.title : exp.title_en }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {{ locale === 'ar' ? exp.description : exp.description_en }}
                  </p>
                </div>
              </div>

              <!-- Education Tab -->
              <div v-else-if="activeTab === 'education'">
                <div class="bg-white dark:bg-[#24262b] p-10 rounded-[3rem] shadow-xl border border-gray-50 dark:border-white/5">
                  <div class="flex items-center gap-5 mb-8 text-primary">
                    <i class="fas fa-graduation-cap text-5xl"></i>
                    <h4 class="text-2xl md:text-3xl font-black">
                      {{ locale === 'ar' ? aboutData.education.title : aboutData.education.title_en }}
                    </h4>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 leading-loose font-medium text-lg md:text-xl">
                    {{ locale === 'ar' ? aboutData.education.description : aboutData.education.description_en }}
                  </p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-primary { color: #FF8C00; }
.bg-primary { background-color: #FF8C00; }
.border-primary { border-color: #FF8C00; }

.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
