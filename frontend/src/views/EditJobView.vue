<template>
    <section class="bg-green-50">
      <div class="container m-auto max-w-2xl py-10">
        <div
          class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
        >
          <form @submit.prevent="handleSubmit">
            <h2 class="text-3xl text-center font-semibold mb-6">Edit Job</h2>

            <div class="mb-4">
              <label for="type" class="block text-gray-700 font-bold mb-2"
                >Job Type</label
              >
              <select
                v-model="form.type"
                id="type"
                name="type"
                class="border rounded w-full py-2 px-3"
                required
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div class="mb-4">
              <label 
              for="name"
              class="block text-gray-700 font-bold mb-2"
                >Job Listing Name</label
              >
              <input
              v-model="form.title"
                type="text"
                id="name"
                name="title"
                class="border rounded w-full py-2 px-3 mb-2"
                placeholder="eg. Beautiful Apartment In Miami"
                required
              />
            </div>
            <div class="mb-4">
              <label
                for="description"
                class="block text-gray-700 font-bold mb-2"
                >Description</label
              >
              <textarea
              v-model="form.description"
                id="description"
                name="description"
                class="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="Add any job duties, expectations, requirements, etc"
              ></textarea>
            </div>

            <div class="mb-4">
              <label for="type" class="block text-gray-700 font-bold mb-2"
                >Salary</label
              >
              <select
                v-model="form.salary"
                id="salary"
                name="salary"
                class="border rounded w-full py-2 px-3"
                required
              >
                <option value="Under $50K">under $50K</option>
                <option value="$50K - $60K">$50 - $60K</option>
                <option value="$60K - $70K">$60 - $70K</option>
                <option value="$70K - $80K">$70 - $80K</option>
                <option value="$80K - $90K">$80 - $90K</option>
                <option value="$90K - $100K">$90 - $100K</option>
                <option value="$100K - $125K">$100 - $125K</option>
                <option value="$125K - $150K">$125 - $150K</option>
                <option value="$150K - $175K">$150 - $175K</option>
                <option value="$175K - $200K">$175 - $200K</option>
                <option value="Over $200K">Over $200K</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2">
                Location
              </label>
              <input
                v-model="form.location"
                type="text"
                id="location"
                name="location"
                class="border rounded w-full py-2 px-3 mb-2"
                placeholder="Company Location"
                required
              />
            </div>

            <h3 class="text-2xl mb-5">Company Info</h3>

            <div class="mb-4">
              <label for="company" class="block text-gray-700 font-bold mb-2"
                >Company Name</label
              >
              <input
                v-model="form.company_name"
                type="text"
                id="company"
                name="company_name"
                class="border rounded w-full py-2 px-3"
                placeholder="Company Name"
              />
            </div>

            <div class="mb-4">
              <label
                for="company_description"
                class="block text-gray-700 font-bold mb-2"
                >Company Description</label
              >
              <textarea
                v-model="form.company_description"
                id="company_description"
                name="company_description"
                class="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="What does your company do?"
              ></textarea>
            </div>

            <div class="mb-4">
              <label
                for="contact_email"
                class="block text-gray-700 font-bold mb-2"
                >Contact Email</label
              >
              <input
                v-model="form.company_contact_email"
                type="email"
                id="contact_email"
                name="company_contact_email"
                class="border rounded w-full py-2 px-3"
                placeholder="Email address for applicants"
                required
              />
            </div>
            <div class="mb-4">
              <label
                for="contact_phone"
                class="block text-gray-700 font-bold mb-2"
                >Contact Phone</label
              >
              <input
                v-model="form.company_contact_phone"
                type="tel"
                id="contact_phone"
                name="company_contact_phone"
                class="border rounded w-full py-2 px-3"
                placeholder="Optional phone for applicants"
              />
            </div>

            <div>
              <button
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
</template>

<script>
    import { useToast } from 'vue-toastification';
    import router from '@/router';
    import { useRoute } from 'vue-router';
    import axios from 'axios';

    export default {
        setup() {
            const route = useRoute();
            const toast = useToast();
            const jobId = route.params.id;

            return { route, toast, jobId };
        },
        data() {
            return {
                form: {
                    type: "Full-Time",
                    title: "",
                    description: "",
                    location: "",
                    salary: "",
                    company_name: "",
                    company_description: "",
                    company_contact_email: "",
                    company_contact_phone: ""
                },
                state: {
                    job: {},
                    isLoading: true
                }
            }
        },
        methods: {
            async handleSubmit() {
                const formData = new FormData();

                formData.append('type', this.form.type);
                formData.append('title', this.form.title);
                formData.append('description', this.form.description);
                formData.append('location', this.form.location);
                formData.append('salary', this.form.salary);
                formData.append('company_name', this.form.company_name);
                formData.append('company_description', this.form.company_description);
                formData.append('company_contact_email', this.form.company_contact_email);
                formData.append('company_contact_phone', this.form.company_contact_phone);

                try {
                    const response = await axios.put(`https://greenjobs.vercel.app/api/jobs/edit/${this.jobId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    this.toast.success('Job update successfully');
                    router.push(`/jobs/${response.data.id}`);
                } catch (error) {
                    console.error(error);
                    this.toast.error('Failed to update job');
                }
            },
            async fetchJob() {
                try {
                    const response = await axios.get(`/api/jobs/${this.jobId}`);
                    this.state.job = response.data;
                    this.form.type = this.state.job.type;
                    this.form.title = this.state.job.title;
                    this.form.description = this.state.job.description;
                    this.form.location = this.state.job.location;
                    this.form.salary = this.state.job.salary;
                    this.form.company_name = this.state.job.company_name;
                    this.form.company_description = this.state.job.company_description;
                    this.form.company_contact_email = this.state.job.company_contact_email;
                    this.form.company_contact_phone = this.state.job.company_contact_phone;
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