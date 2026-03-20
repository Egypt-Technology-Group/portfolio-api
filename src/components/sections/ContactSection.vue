<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import siteConfig from '@/config/site'
import { submitContactForm } from '@/api/contact'

const { t, locale } = useI18n({ useScope: 'global' })

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const apiError = ref(null)

const errors = ref({
  name: '',
  message: ''
})

const validateForm = () => {
  let isValid = true
  errors.value.name = ''
  errors.value.message = ''

  if (form.value.name.length < 3) {
    errors.value.name = locale.value === 'ar' ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : 'Name must be at least 3 characters'
    isValid = false
  }

  if (form.value.message.length < 10) {
    errors.value.message = locale.value === 'ar' ? 'الرسالة يجب أن تكون 10 أحرف على الأقل' : 'Message must be at least 10 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  if (!validateForm()) return

  isSubmitting.value = true
  submitSuccess.value = false
  apiError.value = null

  try {
    const response = await submitContactForm(form.value)
    
    if (response.success) {
      submitSuccess.value = true
      form.value = { name: '', email: '', subject: '', message: '' }
    } else {
      apiError.value = response.error
    }
  } catch (error) {
    apiError.value = locale.value === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}

const openWhatsApp = () => {
  const whatsappMessage = encodeURIComponent(
    `*New message from portfolio*\n\n` +
    `*Name:* ${form.value.name}\n` +
    `*Email:* ${form.value.email}\n` +
    `*Subject:* ${form.value.subject}\n\n` +
    `*Message:*\n${form.value.message}`
  )
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${whatsappMessage}`
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank')
  }
}

// SEO Script Management
let seoScript = null

const addStructuredData = () => {
  if (typeof document === 'undefined') return
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": t('contact.title'),
    "description": t('contact.subtitle'),
    "url": typeof window !== 'undefined' ? window.location.href : ''
  }
  
  seoScript = document.createElement('script')
  seoScript.type = 'application/ld+json'
  seoScript.id = 'seo-contact-data'
  seoScript.textContent = JSON.stringify(structuredData)
  document.head.appendChild(seoScript)
}

const removeStructuredData = () => {
  if (typeof document !== 'undefined' && seoScript && seoScript.parentNode) {
    seoScript.parentNode.removeChild(seoScript)
  }
}

onMounted(() => {
  addStructuredData()
})

onUnmounted(() => {
  removeStructuredData()
})

const socialLinks = [
  { name: 'Facebook', url: siteConfig.social.facebook, icon: 'fab fa-facebook-f', color: '#1877F2' },
  { name: 'LinkedIn', url: siteConfig.social.linkedin, icon: 'fab fa-linkedin-in', color: '#0A66C2' },
  { name: 'WhatsApp', action: openWhatsApp, icon: 'fab fa-whatsapp', color: '#25D366' },
  { name: 'Telegram', url: siteConfig.social.telegram, icon: 'fab fa-telegram-plane', color: '#24A1DE' }
]
</script>

<template>
  <section id="contact" class="min-h-screen bg-[#f4f4f2] dark:bg-[#1a1c20] relative overflow-hidden py-16 px-4 flex items-center justify-center transition-colors duration-500">
    <!-- Background Decorations -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 opacity-[0.05] bg-pattern"></div>
      <div class="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[10%] right-[5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-7xl relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
          {{ t('contact.title') }}
        </h2>
        <div class="flex justify-center items-center gap-2">
          <div class="w-16 h-1.5 bg-primary rounded-full"></div>
          <div class="w-3 h-3 bg-gray-900 dark:bg-white rotate-45"></div>
          <div class="w-16 h-1.5 bg-primary rounded-full"></div>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 items-stretch">
        <!-- Contact Form -->
        <div class="lg:col-span-7 bg-white dark:bg-[#24262b] p-8 md:p-12 rounded-[40px] shadow-xl border-t-4 border-primary">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-4">
            <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
              <i class="fas fa-paper-plane"></i>
            </div>
            {{ t('contact.subtitle') }}
          </h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <input 
                  v-model="form.name" 
                  type="text" 
                  required 
                  :placeholder="t('contact.name')" 
                  class="form-input"
                  :class="{'border-red-500': errors.name}"
                >
                <p v-if="errors.name" class="text-red-500 text-xs font-bold px-2">{{ errors.name }}</p>
              </div>
              <div class="space-y-2">
                <input 
                  v-model="form.email" 
                  type="email" 
                  required 
                  :placeholder="t('contact.email')" 
                  class="form-input"
                >
              </div>
            </div>
            
            <input 
              v-model="form.subject" 
              type="text" 
              required 
              :placeholder="t('contact.subject')" 
              class="form-input"
            >
            
            <div class="space-y-2">
              <textarea 
                v-model="form.message" 
                required 
                :placeholder="t('contact.message')" 
                class="form-input h-40 resize-none"
                :class="{'border-red-500': errors.message}"
              ></textarea>
              <p v-if="errors.message" class="text-red-500 text-xs font-bold px-2">{{ errors.message }}</p>
            </div>
            
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full h-16 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="isSubmitting" class="fas fa-circle-notch animate-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
              {{ isSubmitting ? t('contact.sending') : t('contact.send') }}
            </button>

            <!-- Success/Error Messages -->
            <transition name="fade">
              <div v-if="submitSuccess" class="p-4 bg-green-100 text-green-700 rounded-xl text-center font-bold">
                {{ t('contact.success') }}
              </div>
              <div v-else-if="apiError" class="p-4 bg-red-100 text-red-700 rounded-xl text-center font-bold">
                {{ apiError }}
              </div>
            </transition>
          </form>
        </div>

        <!-- Info & Social -->
        <div class="lg:col-span-5 bg-white dark:bg-[#24262b] p-8 md:p-12 rounded-[40px] shadow-xl border-b-4 border-primary flex flex-col justify-center">
          <div class="text-center lg:text-start mb-10">
            <div class="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
              <i class="fas fa-comments text-3xl text-primary"></i>
            </div>
            <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-4">
              {{ t('contact.stayInTouch') }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
              {{ t('contact.stayInTouchDesc') }}
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <template v-for="social in socialLinks" :key="social.name">
              <a 
                v-if="social.url"
                :href="social.url" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="social-card group"
              >
                <i :class="[social.icon, 'text-2xl group-hover:scale-110 transition-transform']" :style="{ color: social.color }"></i>
                <span class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ social.name }}</span>
              </a>
              <button 
                v-else-if="social.action"
                @click="social.action"
                class="social-card group border-none cursor-pointer w-full text-start"
              >
                <i :class="[social.icon, 'text-2xl group-hover:scale-110 transition-transform']" :style="{ color: social.color }"></i>
                <span class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ social.name }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@reference "../../style.css";

.text-primary { color: #FF8C00; }
.bg-primary { background-color: #FF8C00; }
.border-primary { border-color: #FF8C00; }

.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' fill='none' stroke='%23FF8C00' stroke-width='1'/%3E%3C/svg%3E");
  background-size: 80px 80px;
}

.form-input {
  @apply w-full bg-gray-50 dark:bg-[#111214] rounded-xl px-6 py-4 text-gray-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-primary transition-all shadow-inner;
}

.social-card {
  @apply flex items-center gap-3 bg-gray-50 dark:bg-[#111214] p-4 rounded-2xl border-2 border-transparent shadow-sm transition-all no-underline hover:border-primary hover:scale-[1.05];
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
