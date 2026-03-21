<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSkills, getSettings } from '@/api/portfolio'

const { t } = useI18n({ useScope: 'global' })

const skills = ref([])
const settings = ref(null)
const loading = ref(true)

const fetchData = async () => {
  try {
    loading.value = true
    skills.value = await getSkills()
    settings.value = await getSettings()
  } catch (err) {
    console.error('Failed to fetch data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <section id="skills"
    class="w-full bg-gray-50 dark:bg-[#1a1c20] py-16 overflow-hidden select-none transition-colors duration-500">
    <div class="text-center mb-12 px-4">
      <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
        {{ t('skills.title') }}
        <span class="text-primary">& {{ t('skills.subtitle') }}</span>
      </h2>

      <p class="text-gray-500 dark:text-gray-400 font-bold text-sm">
        {{ t('skills.description') }}
      </p>

      <div class="w-24 h-1.5 mx-auto mt-4 rounded-full bg-primary opacity-80 shadow-lg shadow-primary/20"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
        <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
        <div class="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
      </div>
    </div>

    <div v-else class="skills-container" :style="{ '--d': (settings?.skills_marquee_speed || 70) + 's', '--n': skills.length || 1 }">
      <div v-for="(skill, index) in skills" :key="`${skill.name}-${index}`" class="skill-item group" :title="skill.name" :style="{ '--i': index }">
        <div
          class="w-20 h-20 bg-gray-50 dark:bg-[#24262b] rounded-full flex items-center justify-center text-4xl shadow-md transition-all duration-300 group-hover:scale-110">
          <!-- Use SVG path if available -->
          <svg v-if="skill.svg_path" :viewBox="skill.svg_viewbox || '0 0 24 24'"
               class="w-10 h-10"
               :style="skill.preserve_color && skill.svg_fill ? {} : { fill: skill.color || '#ff8c00' }">
            <path :d="skill.svg_path" :fill="skill.preserve_color ? (skill.svg_fill || 'currentColor') : (skill.color || '#ff8c00')"></path>
          </svg>
          <!-- Fallback to icon image if available (PNG, JPG, GIF, or SVG file) -->
          <img v-else-if="skill.icon && (skill.icon.includes('.png') || skill.icon.includes('.jpg') || skill.icon.includes('.gif') || skill.icon.includes('.svg'))" 
               :src="skill.icon" :alt="skill.name" class="w-10 h-10 object-contain" />
          <!-- Empty state for FontAwesome-only skills -->
          <div v-else class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs" :style="{ color: skill.color || '#ff8c00' }">
            {{ skill.name.charAt(0) }}
          </div>
        </div>

        <span
          class="mt-3 text-[12px] font-black text-black/60 dark:text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {{ skill.name }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-primary {
  color: #ff8c00;
}

.bg-primary {
  background-color: #ff8c00;
}

.skills-container {
  --s: 90px;
  /* icon block width */
  --d: 70s;
  /* duration */
  --n: 15;
  /* number of items */

  display: flex;
  overflow: hidden;
  align-items: center;
  position: relative;
  padding-block: 1.5rem;
  background: transparent;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}

:global(.dark) .skills-container {
  border-color: transparent;
}

.skill-item {
  width: var(--s);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;

  offset: shape(from calc(var(--s) / -2) 50%,
      hline by calc(sibling-count() * max(100% / var(--n), var(--s) + 32px)));

  animation: marquee-offset var(--d) linear infinite calc(-1 * sibling-index() * var(--d) / sibling-count());
}

.skills-container:hover .skill-item {
  animation-play-state: paused;
}

/* Icon wrapper - force dark mode colors */
.skill-item > div > div.w-20.h-20 {
  background-color: rgb(249, 250, 251) !important;
}

:global(.dark) .skill-item > div > div.w-20.h-20 {
  background-color: rgb(36, 38, 43) !important;
}

/* Skill name text - force dark mode colors */
.skill-item > div > span.mt-3 {
  color: rgba(0, 0, 0, 0.6) !important;
}

:global(.dark) .skill-item > div > span.mt-3 {
  color: rgba(255, 255, 255, 0.6) !important;
}

@keyframes marquee-offset {
  to {
    offset-distance: 100%;
  }
}
</style>
