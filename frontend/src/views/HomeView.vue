<template>
    <Hero title="Find Environmental Jobs" description="Browse our environmental jobs and start your green career today!"></Hero>
    <HomeCards></HomeCards>
    <JobListings :limit="3" :showButton="true"></JobListings>
</template>

<script>
    import Hero from "@/components/Hero.vue";
    import HomeCards from "@/components/HomeCards.vue";
    import JobListings from "@/components/JobListings.vue";

    export default {
        components: {
            Hero,
            HomeCards,
            JobListings
        }
    };
</script>