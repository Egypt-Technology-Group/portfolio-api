<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTestimonials } from '@/api/portfolio'

const { t, locale } = useI18n({ useScope: 'global' })

const testimonials = ref([])
const loading = ref(true)
const currentIndex = ref(0)
const isAnimating = ref(false)
const autoPlayInterval = ref(null)
const touchStartX = ref(0)
const touchEndX = ref(0)

const fetchTestimonials = async () => {
  try {
    loading.value = true
    testimonials.value = await getTestimonials()
  } catch (err) {
    console.error('Failed to fetch testimonials:', err)
  } finally {
    loading.value = false
  }
}

const goTo = (index) => {
  if (isAnimating.value || testimonials.value.length === 0) return
  isAnimating.value = true
  currentIndex.value = (index + testimonials.value.length) % testimonials.value.length
  setTimeout(() => { isAnimating.value = false }, 500)
}

const next = () => goTo(currentIndex.value + 1)
const prev = () => goTo(currentIndex.value - 1)

const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayInterval.value = setInterval(next, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) clearInterval(autoPlayInterval.value)
}

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  stopAutoPlay()
}

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX
  const delta = touchEndX.value - touchStartX.value
  if (Math.abs(delta) > 50) {
    delta < 0 ? next() : prev()
  }
  startAutoPlay()
}

onMounted(async () => {
  await fetchTestimonials()
  startAutoPlay()
})
onUnmounted(stopAutoPlay)
</script>

<template>
  <section
    id="testimonials"
    class="testimonials-section"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Background decorations -->
    <div class="bg-blob bg-blob--1"></div>
    <div class="bg-blob bg-blob--2"></div>

    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <p class="section-eyebrow">{{ t('testimonials.quote') }}</p>
        <h2 class="section-title">
          {{ t('testimonials.title') }}
          <span class="section-title--accent">{{ t('testimonials.subtitle') }}</span>
        </h2>
        <div class="section-divider"></div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-500 font-bold">{{ t('common.loading') }}</p>
      </div>

      <!-- Carousel -->
      <div v-else-if="testimonials.length > 0" class="carousel">
        <!-- Cards -->
        <div class="cards-wrapper">
          <TransitionGroup name="card" tag="div" class="cards-track">
            <div
              v-for="(testimonial, index) in testimonials"
              :key="testimonial.id"
              v-show="index === currentIndex"
              class="card"
            >
              <!-- Big quote icon -->
              <div class="card__quote-icon">
                <i class="fas fa-quote-left"></i>
              </div>

              <!-- Comment text -->
              <p class="card__comment">
                {{ locale === 'ar' ? testimonial.content_ar : testimonial.content_en }}
              </p>

              <!-- Stars -->
              <div class="card__stars">
                <i v-for="star in 5" :key="star" class="fas fa-star"></i>
              </div>

              <!-- Divider -->
              <div class="card__divider"></div>

              <!-- Author -->
              <div class="card__author">
                <div class="card__avatar-wrapper">
                  <img
                    :src="testimonial.avatar"
                    :alt="locale === 'ar' ? testimonial.client_name_ar : testimonial.client_name_en"
                    class="card__avatar"
                    draggable="false"
                  />
                  <div class="card__avatar-glow"></div>
                </div>
                <div class="card__author-info">
                  <h3 class="card__author-name">
                    {{ locale === 'ar' ? testimonial.client_name_ar : testimonial.client_name_en }}
                  </h3>
                  <p class="card__author-role">
                    {{ locale === 'ar' ? testimonial.role_ar : testimonial.role_en }}
                  </p>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Dot indicators -->
        <div class="dots">
          <button
            v-for="(_, index) in testimonials"
            :key="index"
            class="dot"
            :class="{ 'dot--active': index === currentIndex }"
            @click="goTo(index); stopAutoPlay(); startAutoPlay()"
            :aria-label="`Go to testimonial ${index + 1}`"
          ></button>
        </div>

        <!-- Navigation arrows -->
        <div class="nav-arrows">
          <button class="nav-arrow" @click="prev(); stopAutoPlay(); startAutoPlay()" aria-label="Previous">
            <i :class="['fas', locale === 'ar' ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
          </button>

          <!-- Progress bar -->
          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :style="{ width: ((currentIndex + 1) / testimonials.length) * 100 + '%' }"
            ></div>
          </div>

          <button class="nav-arrow" @click="next(); stopAutoPlay(); startAutoPlay()" aria-label="Next">
            <i :class="['fas', locale === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right']"></i>
          </button>
        </div>
      </div>

      <!-- Side cards (desktop decoration) -->
      <div v-if="testimonials.length >= 3" class="side-cards" aria-hidden="true">
        <div
          v-for="offset in [-1, 1]"
          :key="offset"
          class="side-card"
          :class="offset === -1 ? 'side-card--left' : 'side-card--right'"
        >
          <div class="side-card__inner">
            <i class="fas fa-quote-left side-card__icon"></i>
            <p class="side-card__text">
              {{
                locale === 'ar'
                  ? testimonials[(currentIndex + offset + testimonials.length) % testimonials.length].content_ar.slice(0, 80)
                  : testimonials[(currentIndex + offset + testimonials.length) % testimonials.length].content_en.slice(0, 80)
              }}…
            </p>
            <div class="side-card__author">
              <img
                :src="testimonials[(currentIndex + offset + testimonials.length) % testimonials.length].avatar"
                class="side-card__avatar"
                draggable="false"
              />
              <span>{{
                locale === 'ar'
                  ? testimonials[(currentIndex + offset + testimonials.length) % testimonials.length].client_name_ar
                  : testimonials[(currentIndex + offset + testimonials.length) % testimonials.length].client_name_en
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../../style.css";

/* ─── Layout ─────────────────────────────────────────────────── */
.testimonials-section {
  position: relative;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 6rem 1rem;
  overflow: hidden;
  transition: background-color 0.5s;

  @apply dark:bg-dark-bg;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* ─── Blobs ───────────────────────────────────────────────────── */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  opacity: 0.12;
}
.bg-blob--1 {
  width: 500px;
  height: 500px;
  background: #FF8C00;
  top: -100px;
  right: -150px;
}
.bg-blob--2 {
  width: 400px;
  height: 400px;
  background: #FF8C00;
  bottom: -100px;
  left: -120px;
}

/* ─── Header ──────────────────────────────────────────────────── */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}
.section-eyebrow {
  color: #FF8C00;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.section-title {
  @apply text-4xl md:text-5xl font-black text-gray-900 dark:text-white;
  transition: color 0.3s;
}
.section-title--accent {
  color: #FF8C00;
}
.section-divider {
  width: 5rem;
  height: 4px;
  background: #FF8C00;
  opacity: 0.3;
  border-radius: 9999px;
  margin: 1rem auto 0;
}

/* ─── Main Carousel ───────────────────────────────────────────── */
.carousel {
  position: relative;
}

.cards-wrapper {
  position: relative;
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards-track {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Card ────────────────────────────────────────────────────── */
.card {
  @apply bg-white dark:bg-dark-card;
  width: 100%;
  max-width: 680px;
  border-radius: 2rem;
  padding: 3rem 2.5rem 2.5rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255,140,0,0.08);
  border-bottom: 6px solid #FF8C00;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

.card__quote-icon {
  font-size: 3.5rem;
  color: #FF8C00;
  opacity: 0.15;
  line-height: 1;
  margin-bottom: -0.5rem;
}

.card__comment {
  @apply text-gray-700 dark:text-gray-200;
  font-size: 1.1rem;
  line-height: 1.85;
  font-style: italic;
  font-weight: 500;
  flex: 1;
}

.card__stars {
  display: flex;
  gap: 0.25rem;
  color: #FF8C00;
  font-size: 0.9rem;
}

.card__divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,140,0,0.3), transparent);
  margin: 0.25rem 0;
}

.card__author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card__avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  object-fit: cover;
  border: 3px solid rgba(255, 140, 0, 0.4);
  display: block;
}

.card__avatar-glow {
  position: absolute;
  inset: -4px;
  border-radius: 1.25rem;
  background: radial-gradient(circle, rgba(255,140,0,0.25) 0%, transparent 70%);
  pointer-events: none;
}

.card__author-name {
  @apply text-gray-900 dark:text-white;
  font-weight: 800;
  font-size: 1.05rem;
}

.card__author-role {
  color: #FF8C00;
  font-size: 0.82rem;
  font-weight: 700;
  margin-top: 0.2rem;
}

/* ─── Card Transition ─────────────────────────────────────────── */
.card-enter-active,
.card-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.97);
}
.card-leave-active {
  position: absolute;
  width: 100%;
  max-width: 680px;
}

/* ─── Dots ────────────────────────────────────────────────────── */
.dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;

  @apply dark:bg-white/20;
}

.dot--active {
  background: #FF8C00;
  width: 28px;
}

/* ─── Navigation ──────────────────────────────────────────────── */
.nav-arrows {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.nav-arrow {
  @apply bg-white dark:bg-dark-card;
  width: 48px;
  height: 48px;
  border-radius: 1rem;
  border: none;
  color: #FF8C00;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s;
  flex-shrink: 0;
}
.nav-arrow:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(255, 140, 0, 0.25);
}
.nav-arrow:active {
  transform: scale(0.95);
}

.progress-bar {
  width: 200px;
  height: 4px;
  @apply bg-gray-200 dark:bg-white/10;
  border-radius: 9999px;
  overflow: hidden;
}
.progress-bar__fill {
  height: 100%;
  background: #FF8C00;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

/* ─── Side cards (desktop only) ───────────────────────────────── */
.side-cards {
  display: none;
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }

  .side-cards {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 0;
    padding: 0 1rem;
  }

  .side-card {
    width: 240px;
    opacity: 0;
    animation: fadeInSide 0.6s ease 0.3s forwards;
  }

  @keyframes fadeInSide {
    to { opacity: 1; }
  }

  .side-card__inner {
    @apply bg-white dark:bg-dark-card;
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    border-bottom: 4px solid rgba(255,140,0,0.3);
    filter: blur(0px);
    opacity: 0.5;
    transform: scale(0.92);
    transition: all 0.4s;
  }

  .side-card__icon {
    color: #FF8C00;
    opacity: 0.2;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .side-card__text {
    @apply text-gray-600 dark:text-gray-400;
    font-size: 0.78rem;
    line-height: 1.6;
    font-style: italic;
    margin-bottom: 0.75rem;
  }

  .side-card__author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    @apply text-gray-800 dark:text-gray-300;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .side-card__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
