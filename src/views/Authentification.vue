<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/components/Auth'

const router = useRouter()
const { isAuthentificated } = useAuth()

const message = ref('')
// const isAuthenticated = ref(false)
const login = ref(
    {
        email: '',
        password: ''
    }
)
const register = ref(
    {
        prenom: '',
        nom: '',
        username: '',
        email: '',
        password: '',
        bio: '',
        profile_picture: null as File | null
    }
)

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files) {
        register.value.profile_picture = target.files[0]
    }
}

async function Register(){
    // const body = {
    //     prenom: register.value.prenom,
    //     nom: register.value.nom,
    //     username: register.value.username,
    //     email: register.value.email,
    //     password: register.value.password,
    //     bio: register.value.bio,
    //     profile_picture: register.value.profile_picture
    // }

    const formData = new FormData()

    const email = register.value.email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        message.value = "Veuillez entrer une adresse mail valide"
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
    }

    formData.append('prenom', register.value.prenom)
    formData.append('nom', register.value.nom)
    formData.append('username', register.value.username)
    formData.append('email', email)  
    formData.append('password', register.value.password)
    formData.append('bio', register.value.bio)
    if (register.value.profile_picture) {
        formData.append('profile_picture', register.value.profile_picture)
    } 

    try{
        
        const response = await fetch('http://localhost:3001/api/auth/signup', {
        // const response = await fetch('https://cda-api-eta.vercel.app/api/auth/signup', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(body)
            body: formData
        })
        
        const data = await response.json()
        
        if(!response.ok){            
            message.value = data?.message || "Erreur lors de la connexion"
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        if(data.accesToken){
            localStorage.setItem('token', data.accesToken)
            localStorage.setItem('userId', data.id)
            message.value = "Inscription réussie"
        } else {
            message.value = "Erreur lors de l'inscription..."
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        router.push('/')
    } catch(error){
        console.error("Erreur lors de l'inscription:", error)
        message.value = "Erreur lors de l'inscription"
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

async function Login(){
    const body = {
        email: login.value.email,
        password: login.value.password
    }
    try{
        // const response = await fetch('https://cda-api-eta.vercel.app/api/auth/signin', {
        const response = await fetch('http://localhost:3001/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    
        const data = await response.json()
        console.log('data:', data)

        if (!response.ok) {
            message.value = data?.message || "Erreur lors de la connexion"
            return
        }
        

        if(data.accesToken){
            localStorage.setItem('token', data.accesToken)
            localStorage.setItem('userId', data.id)
            message.value = "Connecté"
        } else {
            message.value = "Erreur lors de la connexion..."
        }

        router.push('/')
    } catch(error: any){
        console.error('Erreur lors de la connexion:', error)
        message.value = error.message || "Erreur inconnu"
    }
}
onMounted(() => {
    if(isAuthentificated()){
        router.push('/')
    } 
})
</script>

<template>
    
    <div class="authentification">        
        <h1 class="h1-auth">Authentification</h1>
        <img src="../../public/InstaCars.png" alt="InstaCars" width="100" height="100">
    </div>

    <span v-if="message" class="span-error"><p>{{ message }}</p></span>

    <section  class="section-auth">
        <div class="main-div">
            <h2 class="h2-auth">Connexion</h2>
            <form class="form-auth">
                <label for="email">Email:</label>
                <input type="email" v-model="login.email" name="email" required>

                <label for="password">Mot de passe:</label>
                <input type="password" v-model="login.password" name="password" required>

                <button @click.prevent="Login">Se connecter</button>
            </form>
        </div>

        <div class="main-div">
            <h2 class="h2-auth">Inscription</h2>
            <form class="form-auth">
                <div class="second-div">
                    <div>                        
                        <label for="new-prenom">Prénom: <span class="oblig">*</span></label>
                        <input type="text" v-model="register.prenom" name="new-prenom" required class="second-input">
                    </div>
    
                    <div>                        
                        <label for="new-nom">Nom: <span class="oblig">*</span></label>
                        <input type="text" v-model="register.nom" name="new-nom" required class="second-input">
                    </div>
                </div>

                <label for="new-username">Nom d'utilisateur: <span class="oblig">*</span></label>
                <input type="text" v-model="register.username" name="new-username" required>

                <label for="new-email">Email: <span class="oblig">*</span></label>
                <input type="email" v-model="register.email" name="new-email" required>

                <label for="new-password">Mot de passe: <span class="oblig">*</span></label>
                <input type="password" v-model="register.password" name="new-password" required>

                <label for="bio">Ajouter une biographie: </label>
                <textarea name="bio" v-model="register.bio" cols="30" rows="5"></textarea>

                <label for="profil_pictures">Photo de profil: </label>
                <input type="file" name="profil_picture" accept="image/*" @change="handleFileChange">

                <button @click.prevent="Register">S'inscrire</button>
            </form>
        </div>
    </section>
</template>

<style scoped>
@import '../assets/auth.css';
</style>