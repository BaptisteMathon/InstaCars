<script setup lang="ts">
    import { ref, onMounted } from 'vue'

    const profil_picture = ref(<string | null>(null))

    onMounted(async () => {
        try{
            const userId = localStorage.getItem('userId')

            const response = await fetch(`http://localhost:3001/user/${userId}`, {
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
            profil_picture.value = `http://localhost:3001/uploads/profil_pictures/${data.profile_picture}`
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
                <li><a href="/">Accueil</a></li>
                <li><a href="/search">Rechercher</a></li>
                <li><a href="/publish">Publier</a></li>
                <li><a href="/profil"><img :src="profil_picture || '/public/utilisateur.png'" alt="profil" width="75" height="75"></a></li>
            </ul>
        </div>
    </header>
</template>

<style scoped>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }

    .div1 {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #000;
    }

    .div1 img {
        margin-right: 10px;
    }

    .div2 ul {
        display: flex;
        list-style: none;
        padding: 0;
        align-items: center;
    }

    .div2 ul a {
        margin: 0 10px;
        text-decoration: none;
        font-size: 1.2em;
        color: #000;
        transition: color 0.5s;
    }

    .div2 ul a:hover {
        color: #007BFF;
    }

    .div2 ul li img {
        border-radius: 50%;
    }
</style>