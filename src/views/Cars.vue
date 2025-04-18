<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    
    const router = useRouter()

    const message = ref('')

    onMounted(() => {
        const token = localStorage.getItem('token')
        if (token) {
            message.value = "Connecté bb"
        } else {
            message.value = "Non connecté ptn"
            router.push('/auth')
        }
    })
</script>

<template>
    <p>{{ message }}</p>
</template>