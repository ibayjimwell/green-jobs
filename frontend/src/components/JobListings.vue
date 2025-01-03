<template>
    <section class="bg-green-50 px-4 py-10">
        <div class="container-xl lg:container m-auto">
            <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
                Browse Jobs
            </h2>
            <div v-if="state.isLoading" class="text-center my-10">
                <PulseLoader></PulseLoader>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <JobListing v-for="job in state.jobs.slice(0, limit || state.jobs.length)" :key="job.id" :job="job"/>
            </div>
        </div>
    </section>
    <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
      <RouterLink
        to="/jobs"
        class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >View All Jobs</RouterLink
      >
    </section>
</template>

<script>
    import JobListing from "@/components/JobListing.vue";
    import { RouterLink } from 'vue-router';
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
    import axios from 'axios';

    export default {
        components: {
            JobListing,
            RouterLink,
            PulseLoader
        },
        props: {
            limit: Number,
            showButton: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                state: {
                    jobs: [],
                    isLoading: true
                }
            }
        },
        methods: {
            async fetchJobs() {
                try {
                    const response = await axios.get('http://localhost:3000/api/jobs');
                    this.state.jobs = response.data;
                } catch (error) {
                    console.error(error);
                } finally {
                    this.state.isLoading = false;
                }
            }
        },
        mounted() {
            this.fetchJobs();
        }
    }
</script>