<script setup lang="ts">

    import {ref, onMounted, watch} from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    import Header from '@/components/Header.vue'
    import { useAuth } from '@/components/Auth'

    const router = useRouter()
    const route = useRoute()
    const {isAuthentificated, logout} = useAuth()

    const originalPP = ref('')
    const imagePreview = ref('')
    const msgError = ref('')
    const boolmsgError = ref(false)
    const oldPassword = ref('')
    const newPassword = ref('')
    const saveUsernameOnLoad = ref<string>('')

    const editProfil = ref(
        {
            prenom: '',
            nom: '',
            username: '',
            profile_picture: null as File | null,
            bio: ''
        }
    )

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        console.log(target)
        if(target.files){
            editProfil.value.profile_picture = target.files[0]
            imagePreview.value = URL.createObjectURL(target.files[0])
        }
    }

    const userId = route.params.id

    async function EditUserInformations(){

        if(editProfil.value.bio.length > 100){
            msgError.value = 'La biographie ne doit pas dépasser 100 caractères'
            boolmsgError.value = true
            window.scrollTo({top: 0, behavior: 'smooth'})
            return
        }

        const formData = new FormData()

        formData.append('prenom', editProfil.value.prenom)
        formData.append('nom', editProfil.value.nom)
        if(editProfil.value.username !== saveUsernameOnLoad.value){
            formData.append('username', editProfil.value.username)
        }
        formData.append('bio', editProfil.value.bio)

        if(editProfil.value.profile_picture instanceof File){
            formData.append('profile_picture', editProfil.value.profile_picture)
        }
        console.log("formData: ", formData)

        const editUserInfo = await fetch(`https://cda-api-eta.vercel.app/user/${userId}`, {
        // const editUserInfo = await fetch(`http://localhost:3001/user/${userId}`, {
            method: 'PUT',
            headers: {
                'x-access-token': localStorage.getItem('token') || ''
            },
            body: formData
        })  

        const data = await editUserInfo.json()

        if(!editUserInfo.ok){
            console.error('Error updating user informations')
            // const errorData = await editUserInfo.json();
            msgError.value = data.message || 'Une erreur est survenue lors de la mise à jour des informations.';
            boolmsgError.value = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            return
        } else {
            router.push('/profil')
        }

        console.log(data)
    }
    
    function DeleteAccountConfirmation(){
        const confirmationElement = document.getElementById("confirmationDeleteAccount");
        if (confirmationElement) {
            confirmationElement.style.display = 'block';
        }
    }

    function dontDeleteAccount(){
        const confirmationElement = document.getElementById("confirmationDeleteAccount");
        if (confirmationElement) {
            confirmationElement.style.display = 'none';
        }
    }

    async function deleteAccount(){
        try{
            const response = await fetch(`https://cda-api-eta.vercel.app/user/${userId}`, {
            // const response = await fetch(`http://localhost:3001/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                }
            })

            if(!response.ok){
                console.error('Error on fetch delete user')
                return 
            } else {
                logout()
                router.push('/auth')
            }
        } catch(err){
            console.error('Error on deleting user')
            return
        }
    }

    async function EditPassword(){

        if(oldPassword.value === "" || newPassword.value === ""){
            msgError.value = 'Veuillez renseigner les champs ancien et nouveau mot de passe'
            boolmsgError.value = true
            window.scrollTo({top: 0, behavior: 'smooth'})
            return
        }
        const JSONtemp = {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
        }

        const response = await fetch(`https://cda-api-eta.vercel.app/user/${localStorage.getItem('userId')}/password`, {
            method: 'PUT',
            headers: {
                'x-access-token': localStorage.getItem('token') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSONtemp)
        })

        const data = await response.json()

        if(!response.ok){
            console.error('Error while editing password')
            msgError.value = data.message || 'Une erreur est survenue lors de la modification de votre mot de passe.';
            boolmsgError.value = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return
        }

        router.push('/profil')
    }

    onMounted( async () => {
        if (!isAuthentificated()) {
            router.push('/auth')
        }

        if(userId !== localStorage.getItem('userId')){
            router.push('/profil')
        }

        try{
            // const userInfo = await fetch(`http://localhost:3001/user/${userId}`, {
            const userInfo = await fetch(`https://cda-api-eta.vercel.app/user/${userId}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                }
            })

            const data = await userInfo.json()

            if(!userInfo){
                console.error('Erreur lors du fetch')
            }

            // console.log(data)
            editProfil.value.prenom = data.prenom
            editProfil.value.nom = data.nom
            editProfil.value.username = data.username
            saveUsernameOnLoad.value = data.username
            editProfil.value.bio = data.bio
            originalPP.value = data.profile_picture
            editProfil.value.profile_picture = data.profile_picture
        } catch(err){
            console.error('Error during fetching user informaiton: ', err)
        }

        const bioLengthElement = document.getElementById('bio-length');

        watch(() => editProfil.value.bio, (newBio) => {
            if (bioLengthElement) {
                bioLengthElement.style.color = newBio.length > 100 ? 'red' : 'black';
            }
        });

        document.title = "InstaCars | Modifier le profil"

    })

</script>

<template>
    <Header/>

    <main class="main-edit-profile" style="margin-bottom: 50px;">       
        <section>
            <h1>Modifier le profil :</h1>

            <div v-if="boolmsgError" class="msg-error"><p>{{ msgError }}</p></div>
    
            <form class="form-edit-profile">
                <div class="prenom-nom">
                    <div>                        
                        <label for="prenom">Prénom: </label>
                        <input type="text" name="prenom" v-model="editProfil.prenom">
                    </div>
        
                    <div class="nom-detail">
                        <label for="nom">Nom: </label>
                        <input type="text" name="nom" v-model="editProfil.nom">
                    </div>
                </div>
    
                <label for="username">Nom d'utiliseur :</label>
                <input type="text" name="username" v-model="editProfil.username">
    
                <label for="profile_picture">Changer la photo de profil</label>
                <input type="file" name="profile_picture" accept="image/*" @change="handleFileChange">

                <div class="imagePre" v-if="imagePreview !== ''">                    
                    <img :src="imagePreview" alt="" width="150vw" height="150vh">
                </div>
    
                <label for="bio">Biographie</label>
                <textarea name="bio" v-model="editProfil.bio"></textarea>
                <p id="bio-length">{{ editProfil.bio.length }} / 100</p>
    
                <button @click.prevent="EditUserInformations">Modifier les informations</button>

                <span @click="DeleteAccountConfirmation" class="deleteAccount">Supprimer le compte</span>
            </form>
        </section>

        <section class="section-edit-password">
            <h2>Modifier le mot de passe</h2>
            
            <form>
                <label for="oldPassword">Ancien mot de passe: </label>
                <input type="password" name="oldPassword" v-model="oldPassword">

                <label for="newPassword">Nouveau mot de passe: </label>
                <input type="password" name="newPassword" v-model="newPassword">

                <button @click.prevent="EditPassword">Modifier le mot de passe</button>
            </form>
        </section>

        <section id="confirmationDeleteAccount">
            <div class="confirmationDeleteAccount">
                <p>Etes vous sur de vouloir supprimer votre compte ?</p>
                <div>
                    <span @click="deleteAccount" class="delete-oui">OUI</span>
                    <span @click="dontDeleteAccount" class="delete-non">NON</span>
                </div>
            </div>
        </section>
    </main>

</template>

<style scoped>
    @import '../assets/editProfil.css'
</style>