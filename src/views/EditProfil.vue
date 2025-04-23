<script setup lang="ts">

    import {ref, onMounted} from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    import Header from '@/components/Header.vue'
    import { useAuth } from '@/components/Auth'

    const router = useRouter()
    const route = useRoute()
    const {isAuthentificated, logout} = useAuth()

    const originalPP = ref('')
    const imagePreview = ref('')

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
        if(target.files){
            editProfil.value.profile_picture = target.files[0]
            imagePreview.value = URL.createObjectURL(target.files[0])
        }
    }

    const userId = route.params.id

    async function EditUserInformations(){
        const formData = new FormData()

        formData.append('prenom', editProfil.value.prenom)
        formData.append('nom', editProfil.value.nom)
        formData.append('username', editProfil.value.username)
        formData.append('bio', editProfil.value.bio)

        if(editProfil.value.profile_picture){
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
            return
        } else {
            // router.push('/profil')
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
            editProfil.value.bio = data.bio
            originalPP.value = data.profile_picture
        } catch(err){
            console.error('Error during fetching user informaiton: ', err)
        }

    })

</script>

<template>
    <Header/>

    <main class="main-edit-profile" style="margin-bottom: 50px;">       
        <section>
            <h1>Modifier le profil :</h1>
    
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
    
                <button @click.prevent="EditUserInformations">Modifier les informations</button>

                <span @click="DeleteAccountConfirmation" class="deleteAccount">Supprimer le compte</span>
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
    @import '../assets//editProfil.css'
</style>