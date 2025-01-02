<template>
    <div v-if="state.isLoading" class="text-center my-10">
        <PulseLoader></PulseLoader>
    </div>
    <section v-else class="bg-green-50">
    <BackButton></BackButton>
      <div class="container m-auto py-10 px-6">
        <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
          <main>
            <div
              class="bg-white p-6 rounded-lg shadow-md text-center md:text-left"
            >
              <div class="text-gray-500 mb-4"> {{ state.job.type }}</div>
              <h1 class="text-3xl font-bold mb-4">{{ state.job.title }}</h1>
              <div
                class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start"
              >
                <p class="text-orange-700">{{ state.job.location }}</p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 class="text-green-800 text-lg font-bold mb-6">
                Job Description
              </h3>

              <p class="mb-4">
               {{ state.job.description }}
              </p>

              <h3 class="text-green-800 text-lg font-bold mb-2">Salary</h3>

              <p class="mb-4">{{ state.job.salary }}</p>
            </div>
          </main>

          <!-- Sidebar -->
          <aside>
            <!-- Company Info -->
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-bold mb-6">Company Info</h3>

              <h2 class="text-2xl">{{ state.job.company_name }}</h2>

              <p class="my-2">
                {{ state.job.company_description }}
              </p>

              <hr class="my-4" />

              <h3 class="text-xl">Contact Email:</h3>

              <p class="my-2 bg-green-100 p-2 font-bold">
                {{ state.job.company_contact_email }}
              </p>

              <h3 class="text-xl">Contact Phone:</h3>

              <p class="my-2 bg-green-100 p-2 font-bold">{{ state.job.company_contact_phone }}</p>
            </div>

            <!-- Manage -->
            <div class="bg-white p-6 rounded-lg shadow-md mt-6">
              <h3 class="text-xl font-bold mb-6">Manage Job</h3>
              <RouterLink
                :to="`/jobs/edit/${state.job.id}`"
                class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >Edit Job</RouterLink
              >
              <button 
                @click="handleDeleteJob"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >
                Delete Job
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
</template>

<script>
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
    import BackButton from '@/components/BackButton.vue';
    import { useToast } from 'vue-toastification';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import axios from 'axios';

    export default {
        components: {
            PulseLoader,
            BackButton,
            RouterLink
        },
        data() {
            return {
                state: {
                    job: {},
                    isLoading: true
                }
            }
        },
        setup() {
            const route = useRoute();
            const router = useRouter();
            const toast = useToast();
            const jobId = route.params.id;

            return { route, router, toast, jobId };
        },
        methods: {
            async handleDeleteJob() {
                try {
                    const confirm = window.confirm('Are you sure you want to delete this job?');
                    if (confirm) {
                        await axios.delete(`/api/jobs/delete/${this.jobId}`);
                        this.toast.success('Job Deleted Successfully');
                        this.router.push('/jobs');
                    }
                } catch (error) {
                    console.error(error);
                }
            },
            async fetchJob() {
                try {
                    const response = await axios.get(`/api/jobs/${this.jobId}`);
                    this.state.job = response.data;
                } catch (error) {
                    console.error(error);
                } finally {
                    this.state.isLoading = false;
                }
            }
        },
        mounted() {
            this.fetchJob();
        }
    }
</script>