<script setup>
import HeroSection from '@/components/sections/HeroSection.vue'
import SkillsMarquee from '@/components/sections/SkillsMarquee.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import ArticlesSection from '@/components/sections/ArticlesSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<template>
  <div class="min-h-screen">
    <HeroSection id="home" />
    <SkillsMarquee id="skills" />
    <ServicesSection id="services" />
    <AboutSection id="about" />
    <ProjectsSection id="projects" />
    <ArticlesSection id="articles" />
    <TestimonialsSection id="testimonials" />
    <ContactSection id="contact" />
  </div>
</template>