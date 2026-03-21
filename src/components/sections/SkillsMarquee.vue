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

    <div v-else class="skills-container" :style="{ '--d': (settings?.skills_marquee_speed || 70) + 's' }">
      <div class="skills-track">
        <!-- Original skills -->
        <div v-for="(skill, index) in skills" :key="`${skill.name}-${index}`" class="skill-item" :title="skill.name">
          <div
            class="skill-icon-wrapper">
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
            class="skill-name">
            {{ skill.name }}
          </span>
        </div>
        <!-- Duplicated skills for seamless loop -->
        <template v-if="skills.length > 0">
          <div v-for="(skill, index) in skills" :key="`dup-${skill.name}-${index}`" class="skill-item" aria-hidden="true">
            <div
              class="skill-icon-wrapper">
              <svg v-if="skill.svg_path" :viewBox="skill.svg_viewbox || '0 0 24 24'"
                   class="w-10 h-10"
                   :style="skill.preserve_color && skill.svg_fill ? {} : { fill: skill.color || '#ff8c00' }">
                <path :d="skill.svg_path" :fill="skill.preserve_color ? (skill.svg_fill || 'currentColor') : (skill.color || '#ff8c00')"></path>
              </svg>
              <img v-else-if="skill.icon && (skill.icon.includes('.png') || skill.icon.includes('.jpg') || skill.icon.includes('.gif') || skill.icon.includes('.svg'))" 
                   :src="skill.icon" :alt="skill.name" class="w-10 h-10 object-contain" />
              <div v-else class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs" :style="{ color: skill.color || '#ff8c00' }">
                {{ skill.name.charAt(0) }}
              </div>
            </div>

            <span
              class="skill-name">
              {{ skill.name }}
            </span>
          </div>
        </template>
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
  --gap: 32px;
  /* gap between items */

  display: flex;
  overflow: hidden;
  align-items: center;
  position: relative;
  padding-block: 1.5rem;
  background: transparent;
}

.skills-track {
  display: flex;
  align-items: center;
  gap: var(--gap);
  animation: marquee var(--d) linear infinite;
  flex-shrink: 0;
  width: max-content;
}

.skills-container:hover .skills-track {
  animation-play-state: paused;
}

.skill-item {
  width: var(--s);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.skill-icon-wrapper {
  width: 5rem;
  height: 5rem;
  background-color: rgb(249, 250, 251);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgb(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:global(.dark) .skill-icon-wrapper {
  background-color: rgb(36, 38, 43);
}

.skill-item:hover .skill-icon-wrapper {
  transform: scale(1.1);
}

.skill-name {
  margin-top: 0.75rem;
  font-size: 12px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

:global(.dark) .skill-name {
  color: rgba(255, 255, 255, 0.6);
}

.skill-item:hover .skill-name {
  opacity: 1;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>