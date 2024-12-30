<template>
    <nav class="bg-green-700 border-b border-green-500">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <div
            class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
          >
            <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
              <img class="h-12 w-auto" :src="logo" alt="Vue Jobs" />
              <span class="hidden md:block text-white text-2xl font-bold ml-2"
                >Green Jobs</span
              >
            </RouterLink>
            <div class="md:ml-auto">
              <div class="flex space-x-2">
                <RouterLink
                  v-for="({ name, path }, index) in [
                    { name: 'Home', path: '/' },
                    { name: 'Jobs', path: '/jobs' },
                    { name: 'Add Job', path: '/jobs/add' },
                  ]"
                  :key="index"
                  :to="path"
                  :class="[
                    'text-white',
                    isActiveLink(path) ? 'bg-green-900' : 'hover:bg-green-900',
                    'hover:text-white',
                    'rounded-md',
                    'px-3',
                    'py-2',
                  ]"
                  >{{ name }}</RouterLink
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
</template>

<script>
    import { RouterLink, useRoute } from "vue-router";
    import logo from "@/assets/img/logo.png";

    export default {
        components: {
            RouterLink,
        },
        data() {
            return {
                logo
            };
        },
        methods: {
            isActiveLink(path) {
                return useRoute().path === path;
            },
        }
    }
</script>