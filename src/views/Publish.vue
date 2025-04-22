<script setup lang="ts">
    import {ref, onMounted } from 'vue'
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

    async function createPublication(){
        if(!newPublication.value.description || !newPublication.value.image){
            message.value = "Veuillez ajouter une description ainsi qu'une image"
        } else {

            const formData = new FormData()            

            const tempTags = newPublication.value.description.split(' ').filter((tag: String) => tag.startsWith('#'))
            // newPublication.value.description = newPublication.value.description.replace(/#\S+\s*/g, '')
            // newPublication.value.tags = tempTags
            // newPublication.value.id = localStorage.getItem("userId") || ''

            formData.append('description', newPublication.value.description.replace(/#\S+\s*/g, ''))
            tempTags.forEach(tag => {
                formData.append('tags[]', tag) 
            })
            // formData.append('tags', JSON.stringify(tempTags))
            formData.append('owner', localStorage.getItem("userId") || '')
            if(newPublication.value.image){
                formData.append('image', newPublication.value.image)
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
        if(!isAuthentificated){
            router.push('/auth')
        }
    })

</script>

<template>

    <Header/>

    <main class="main-publish" style="margin-bottom: 50px;">
        <h1>Créer une nouvelle publication </h1>
        <p>{{ message }}</p>
        <form>
            <div>
                <label for="description"><h3>Description</h3></label>
                <textarea name="description" v-model="newPublication.description" id="description" placeholder="Ajouter votre description" rows="5"></textarea>
            </div>
            <div>   
                <label for="image"><h3>Photo</h3></label>
                <input type="file" name="image" id="image" accept="image/*" @change="handleFileChange">
                <div class="preview-image">                    
                    <img :src="imagePreview" alt="" width="50%">
                </div>
            </div>

            <button @click.prevent="createPublication">Partager la publication</button>
        </form>
    </main>
</template>

<style scoped>
@import '../assets/publish.css'
</style>