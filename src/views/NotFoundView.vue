<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
    <h1 class="text-9xl font-black text-primary mb-4 opacity-20">404</h1>
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
      {{ t('notFound.title') }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
      {{ t('notFound.description') }}
    </p>
    <router-link 
      to="/" 
      class="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-transform"
    >
      {{ t('notFound.backHome') }}
    </router-link>
  </div>
</template>
