<script setup lang="ts">
    import {ref, onMounted, computed} from 'vue'
    import {useRouter} from 'vue-router'
    import {useAuth} from '@/components/Auth'
    import Header from '@/components/Header.vue'

    const router = useRouter()
    const {isAuthentificated} = useAuth()

    const searchQuery = ref('')
    const users = ref<any[]>([])

    const filteredUsers = computed(() => {
        if(searchQuery.value === ""){
            return ""
        }
        return users.value.filter(user => 
            user.username.toLowerCase().startsWith(searchQuery.value.toLowerCase())
        )
    })

    onMounted(async () => {
        if (!isAuthentificated()) {
            router.push('/auth')
        }

        try{
            
            const allUsers = await fetch(`https://cda-api-eta.vercel.app/users`, {
            // const allUsers = await fetch(`http://localhost:3001/users`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || ''
                }
            })

            const data = await allUsers.json()

            if(!allUsers.ok){
                console.error('Erreur lors du fetch users')
                return
            }

            users.value = data

            console.log("user: ", users.value)
        } catch(err){
            console.error('Error durint fetching all users')
        }

        document.title = "InstaCars | Recherche"
    })

</script>

<template>
    <Header/>
    
    <main class="main-search" style="margin-bottom: 50px;">
        <div class="search-container">
            <div class="search-bar">
                <input type="text" v-model="searchQuery" placeholder="Rechercher..." />
            <!-- <button @click="handleSearch"> -->
                <button>
                    <img src="/public/loupe.png" alt="Loop" width="25" height="25">
                </button>
            </div>
        </div>
        <div v-if="filteredUsers.length > 0" class="all-users">
            <ul class="list-users">
                <li v-for="user in filteredUsers" :key="user.id">
                    <a :href="`/profil/${user._id}`">
                        <img :src="`${user.profile_picture}`" alt="User profile" width="60" height="60">
                        <h3>{{ user.username }}</h3>
                    </a>
                </li>
            </ul>
        </div>
    </main>

</template>

<style scoped>
@import '../assets/search.css'
</style>