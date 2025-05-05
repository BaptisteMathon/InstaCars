<script setup lang="ts">
    import { ref, onMounted } from 'vue'

    const profil_picture = ref(<string | null>(null))

    onMounted(async () => {
        try{
            const userId = localStorage.getItem('userId')

            
            const response = await fetch(`https://cda-api-eta.vercel.app/user/${userId}`, {

            // const response = await fetch(`http://localhost:3001/user/${userId}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                }
            })

            const data =  await response.json()

            if (!response.ok) {
                console.error("Erreur lors du fetch")
                return
            }
            profil_picture.value = data.profile_picture
        } catch(error) {
            console.error('Error during onMounted:', error)
        }
    })
</script>

<template>
    <header>
        <a href="/" class="div1">
            <img src="/public/InstaCars.png" alt="InstaCars" width="100" height="100">
            <h2>InstaCars</h2>
        </a>
        <div class="div2">
            <ul>
                <li><a href="/" class="more">Accueil</a></li>
                <li><a href="/search" class="more">Rechercher</a></li>
                <li><a href="/publish" class="more">Publier</a></li>
                <li><a href="/forum" class="more">Forum</a></li>
                <li><a href="/profil"><img :src="profil_picture || '/public/utilisateur.png'" alt="profil" width="75" height="75" class="profil_pic"></a></li>
            </ul>
        </div>

        <div class="div3">
            <ul>
                <li><a href="/" class="less"><img src="/public/home.png" alt="" width="30px" height="30px"></a></li>

                <li><a href="/search" class="less"><img src="/public/search.png" alt="" width="30px" height="30px"></a></li>

                <li><a href="/publish" class="less"><img src="/public/add.png" alt="" width="30px" height="30px"></a></li>

                <li><a href="/profil"><img :src="profil_picture || '/public/utilisateur.png'" alt="profil" width="75" height="75" class="profil_pic"></a></li>
            </ul>
        </div>

        <div class="div4">
            <a href="/forum"><img src="/public/forum.png" alt="forum" width="30px" height="30px"></a>
        </div>
    </header>
</template>

<style scoped>
    @import '../assets/header.css'
</style>