<script setup lang="ts">
    import {ref, onMounted, watch } from 'vue'
    import {useRouter} from 'vue-router'
    import {useAuth} from '@/components/Auth'
    import Header from '@/components/Header.vue'

    const router = useRouter()
    const {isAuthentificated} = useAuth()

    const newPublication = ref(
        {
            id: '',
            image: null as File | null,
            description: '',
            tags: ['']
        }
    )

    const message = ref('')
    const imagePreview = ref('')
    const displayMessage = ref(false)

    async function createPublication(){
        if(!newPublication.value.description || !newPublication.value.image){
            message.value = "Veuillez ajouter une description ainsi qu'une image"
            displayMessage.value = true
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        } else {

            if(newPublication.value.description.length > 100){
                message.value = "La description ne doit pas dépasser 100 caractères"
                displayMessage.value = true
                window.scrollTo({ top: 0, behavior: 'smooth' })
                return
            }

            const formData = new FormData()            

            const tempTags = newPublication.value.description.split(' ').filter((tag: String) => tag.startsWith('#'))

            formData.append('description', newPublication.value.description.replace(/#\S+\s*/g, ''))
            tempTags.forEach(tag => {
                formData.append('tags[]', tag) 
            })
            // formData.append('tags', JSON.stringify(tempTags))
            formData.append('owner', localStorage.getItem("userId") || '')
            if(newPublication.value.image){
                formData.append('image', newPublication.value.image)
                // console.log("newPublication.value.image.type: ", newPublication.value.image.type)
                if(newPublication.value.image.size > 4.5 * 1024 * 1024){
                    message.value = "Le poid de l'image ou de la vidéo doit être inférieur à 4.5Mo 😢"
                    displayMessage.value = true
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    return

                }
            }


            
            const addPost = await fetch("https://cda-api-eta.vercel.app/post/", {
            // const addPost = await fetch("http://localhost:3001/post/", {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token') || ''
                },
                // body: JSON.stringify(newPublication.value)
                body: formData
            })

            const data = await addPost.json()

            if(!addPost.ok) {
                console.error("Errur lors de la création de la publication")
                message.value = `Erreur lors de la création de la publication: ${data?.message}`
                displayMessage.value = true
                window.scrollTo({ top: 0, behavior: 'smooth' })

            }

            router.push('/profil')
        }
    }

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        if(target.files){
            newPublication.value.image = target.files[0]
            imagePreview.value = URL.createObjectURL(target.files[0])
            console.log(target.files[0])
        }
    }

    onMounted(() => {
        if(!isAuthentificated()){
            router.push('/auth')
        }

        const descriptionLength = document.getElementById('description-length')
        watch(() => newPublication.value.description, (newDescription) => {
            if(descriptionLength){
                descriptionLength.style.color = newDescription.length > 100 ? 'red' : 'black'
            }
        })

        document.title = "InstaCars | Publication"
    })

</script>

<template>

    <Header/>

    <main class="main-publish" style="margin-bottom: 50px;">
        <h1>Créer une nouvelle publication </h1>
        <div class="msg-error" v-if="displayMessage">
            <p>{{ message }}</p>
        </div>
        <form>
            <div>   
                <label for="image"><h3>Photo / Vidéo</h3></label>
                <input type="file" name="image" id="image" accept="image/*,video/*" @change="handleFileChange">
                <div class="preview-image">                    
                    <img :src="imagePreview" alt="" width="50%">
                </div>
            </div>
            <div>
                <label for="description"><h3>Description</h3></label>
                <textarea name="description" v-model="newPublication.description" id="description" placeholder="Ajouter votre description" rows="5"></textarea>
                <p id="description-length">{{ newPublication.description.length }} / 100</p>
            </div>

            <button @click.prevent="createPublication">Partager la publication</button>
        </form>
    </main>
</template>

<style scoped>
@import '../assets/publish.css'
</style>