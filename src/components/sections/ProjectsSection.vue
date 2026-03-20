<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProjects } from '@/api/portfolio'

const { t, locale } = useI18n({ useScope: 'global' })

const projects = ref([])
const loading = ref(true)
const error = ref(null)

const activeFilter = ref('All')
const filters = computed(() => {
  return [t('projects.filters.all'), 'HTML/CSS/JS', 'PHP', 'Vue.js', 'React']
})

// Sync activeFilter with language change
const currentFilter = computed(() => {
  if (activeFilter.value === 'All' || activeFilter.value === 'الكل') {
    return t('projects.filters.all')
  }
  return activeFilter.value
})

const filteredProjects = computed(() => {
  let filtered = projects.value
  const filterValue = currentFilter.value
  if (filterValue !== t('projects.filters.all')) {
    filtered = projects.value.filter(project => project.category === filterValue)
  }
  return [...filtered].sort((a, b) => a.order - b.order)
})

const fetchProjects = async () => {
  try {
    loading.value = true
    projects.value = await getProjects()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchProjects)

const getTechIcon = (tech) => {
  const icons = {
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'JavaScript': 'fab fa-js',
    'PHP': 'fab fa-php',
    'MySQL': 'fas fa-database',
    'Bootstrap': 'fab fa-bootstrap',
    'Next.js': 'fas fa-chevron-right',
    'React': 'fab fa-react',
    'Tailwind': 'fas fa-wind',
    'Vue.js': 'fab fa-vuejs'
  }
  return icons[tech] || 'fas fa-code'
}
</script>

<template>
  <section id="projects" class="min-h-screen bg-white dark:bg-[#1a1c20] py-24 px-4 transition-colors duration-500 scroll-mt-20">
    <div class="container mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col items-center text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 relative inline-block">
          {{ t('navbar.projects') }}
          <div class="w-24 h-1.5 bg-primary rounded-full mx-auto mt-2"></div>
        </h2>
        <p class="text-gray-500 dark:text-gray-400 font-bold mt-4 max-w-md">
          {{ t('projects.description') }}
        </p>

        <!-- Filters -->
        <div class="flex flex-wrap justify-center gap-3 mt-10">
          <button
            v-for="filter in filters"
            :key="filter"
            @click="activeFilter = filter"
            :class="[
              'px-6 py-2.5 rounded-xl font-bold transition-all border shadow-sm',
              (activeFilter === filter || (filter === t('projects.filters.all') && (activeFilter === 'All' || activeFilter === 'الكل')))
                ? 'bg-primary text-white border-primary scale-105 shadow-primary/20'
                : 'bg-white dark:bg-[#24262b] text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-primary/50'
            ]"
          >
            {{ filter }}
          </button>
        </div>
      </div>
      
      <!-- Loading/Error States -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-500 font-bold">{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-500 font-bold mb-4">{{ error }}</p>
        <button @click="fetchProjects" class="px-6 py-2 bg-primary text-white rounded-lg font-bold">
          {{ t('common.retry') }}
        </button>
      </div>
      
      <!-- Projects Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="bg-white dark:bg-[#24262b] rounded-3xl overflow-hidden shadow-xl border-b-4 border-primary group transition-all duration-500 hover:-translate-y-2"
        >
          <!-- Project Image -->
          <div class="relative h-64 overflow-hidden bg-gray-100 dark:bg-[#1a1c20]">
            <a :href="project.url" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
              <img 
                :alt="locale === 'ar' ? project.title_ar : project.title_en" 
                class="w-full h-full object-cover object-top transition-opacity duration-500 group-hover:opacity-0" 
                :src="project.image"
              />
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                <div class="w-full h-[1000px] transition-transform duration-[5000ms] ease-linear group-hover:-translate-y-[calc(100%-256px)]">
                  <img 
                    :alt="locale === 'ar' ? project.title_ar : project.title_en" 
                    class="w-full h-full object-cover object-top" 
                    :src="project.preview_image || project.image"
                  />
                </div>
              </div>
            </a>
          </div>

          <!-- Project Info -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {{ locale === 'ar' ? project.title_ar : project.title_en }}
              </h3>
              <span class="text-xs font-bold text-gray-400 whitespace-nowrap">{{ project.date }}</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 h-10">
              {{ locale === 'ar' ? project.description_ar : project.description_en }}
            </p>
            
            <!-- Tech Stack -->
            <div class="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-white/5 justify-center">
              <i 
                v-for="tech in project.technologies" 
                :key="tech"
                :class="[getTechIcon(tech), 'text-xl text-gray-400 hover:text-primary transition-all hover:scale-125']"
                :title="tech"
              ></i>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-primary { color: #FF8C00; }
.bg-primary { background-color: #FF8C00; }
.border-primary { border-color: #FF8C00; }
.shadow-primary { --tw-shadow-color: #FF8C00; }
</style>
