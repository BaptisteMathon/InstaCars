<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuth } from '@/components/Auth'
    import Header from '@/components/Header.vue'


    const router = useRouter()
    const { isAuthentificated } = useAuth()

    onMounted(() => {
        if(!isAuthentificated()){
            router.push('/auth')
        } 
    })
</script>

<template>
    <Header />
</template>