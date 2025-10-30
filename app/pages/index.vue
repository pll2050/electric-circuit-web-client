<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-50">
    <!-- Hero Section -->
    <section class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 text-center">
      <h1 class="text-5xl font-bold mb-4">AI-Driven Electric Circuit Design</h1>
      <p class="text-lg mb-8">Revolutionize your workflow with cutting-edge tools for circuit design and simulation.</p>
      <div class="flex justify-center gap-4">
        <NuxtLink
          to="/editor"
          class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Get Started
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition"
        >
          Learn More
        </NuxtLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto py-16 px-4 text-center">
      <h2 class="text-3xl font-bold mb-8">Packed with Innovation</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src="@/assets/icons/feature1.svg" alt="Feature 1" class="mx-auto mb-4 w-16 h-16" />
          <h3 class="text-xl font-semibold mb-2">Seamless API Integrations</h3>
          <p class="text-gray-600">Connect with your favorite tools effortlessly.</p>
        </div>
        <div>
          <img src="@/assets/icons/feature2.svg" alt="Feature 2" class="mx-auto mb-4 w-16 h-16" />
          <h3 class="text-xl font-semibold mb-2">Real-Time Data</h3>
          <p class="text-gray-600">Get instant insights for faster decision-making.</p>
        </div>
        <div>
          <img src="@/assets/icons/feature3.svg" alt="Feature 3" class="mx-auto mb-4 w-16 h-16" />
          <h3 class="text-xl font-semibold mb-2">Optimized UX/UI</h3>
          <p class="text-gray-600">Smart design that enhances user experience.</p>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="w-full bg-blue-600 text-white py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
      <p class="text-lg mb-8">Join thousands of professionals using our platform to innovate and excel.</p>
      <NuxtLink
        to="/register"
        class="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
      >
        Sign Up Now
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '홈 - Electric Circuit Web'
})
</script>
