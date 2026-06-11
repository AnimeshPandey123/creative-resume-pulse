---
title: "A Beginner's Guide to Vue.js: Practical Implementation and Real-World Applications"
excerpt: 'Vue 3 starter guide using Vite scaffolding, Composition API, Pinia for state, and single-file components—updated from Vue CLI and Vuex patterns.'
publishDate: '2024-12-25'
tags: ['vuejs', 'javascript', 'frontend-development', 'web-development']
---

# A beginner's guide to Vue.js

Vue.js is a progressive framework—use it for a single page widget or a full SPA. I pick Vue when a team wants approachable templates, solid tooling, and a gentler learning curve than some alternatives, without sacrificing structure at scale.

This guide targets **Vue 3** with **Vite** (not the deprecated Vue CLI) and **Pinia** (not Vuex) for state management.

## Why Vue 3?

- **Composition API**: organize logic by feature, not lifecycle hook type—similar mental model to React hooks.
- **Better TypeScript support** than Vue 2.
- **Smaller bundle** with tree-shaking and the modern build pipeline.

## Project setup with Vite

```bash
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install
npm run dev
```

For TypeScript:

```bash
npm create vite@latest my-vue-app -- --template vue-ts
```

## Options API vs Composition API

Vue 3 supports both. New projects should default to Composition API with `<script setup>`:

```vue
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue 3!');

function updateMessage() {
  message.value = 'Updated!';
}
</script>

<template>
  <h1>{{ message }}</h1>
  <button @click="updateMessage">Click me</button>
</template>
```

`ref` wraps primitive values; access them with `.value` in script (not in template). Use `reactive()` for objects.

## Single-file components

Organize UI into `.vue` files—template, script, and scoped styles in one place:

```vue
<!-- src/components/GreetingCard.vue -->
<script setup>
defineProps({
  title: { type: String, required: true },
  content: { type: String, default: '' },
});
</script>

<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
```

Use in a parent:

```vue
<script setup>
import GreetingCard from './components/GreetingCard.vue';
</script>

<template>
  <GreetingCard title="Welcome" content="Built with Vue 3 and Vite." />
</template>
```

## State management with Pinia

Vuex is in maintenance mode. Pinia is the official store for Vue 3:

```bash
npm install pinia
```

```js
// src/stores/counter.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubled, increment };
});
```

Register in `main.js`:

```js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
```

Consume in a component:

```vue
<script setup>
import { useCounterStore } from '../stores/counter';

const store = useCounterStore();
</script>

<template>
  <p>Count: {{ store.count }} (doubled: {{ store.doubled }})</p>
  <button @click="store.increment">+</button>
</template>
```

## Routing

Add Vue Router for multi-page SPAs:

```bash
npm install vue-router@4
```

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
});
```

## Where Vue fits in production

Teams at GitLab, Adobe, and others use Vue for internal tools and customer-facing apps. Laravel ships Vue-friendly scaffolding, though you can pair Vue with any API backend.

## Best practices

1. **Use `<script setup>`** for new components—less boilerplate than the Options API.
2. **Follow the [Vue style guide](https://vuejs.org/style-guide/)** for naming and component structure.
3. **Lazy-load routes** with `() => import('./views/Heavy.vue')` to split bundles.
4. **Prefer Pinia** over Vuex for new projects.
5. **Use Vite** for dev and production builds—faster HMR than webpack-based Vue CLI.

## Summary

Vue 3 with Vite and Pinia is the modern baseline. Start with `<script setup>` and single-file components, add Pinia when prop-drilling gets painful, and reach for Vue Router when you need client-side navigation.
