<script setup lang="ts">
    import {ref, onMounted } from 'vue'
    import {useRouter} from 'vue-router'
    import {useAuth} from '@/components/Auth'
    import Header from '@/components/Header.vue'

    const router = useRouter()
    const {isAuthentificated} = useAuth()

    onMounted(() => {
        if(!isAuthentificated){
            router.push('/auth')
        }
    })

</script>

<template>

    <Header/>

    <main class="main-publish">
        <h1>Créer une nouvelle publication </h1>
        <form>
            <div>
                <label for="description"><h3>Description</h3></label>
                <textarea name="description" id="description" placeholder="Ajouter votre description" rows="5"></textarea>
            </div>
            <div>   
                <label for="image"><h3>Photo</h3></label>
                <input type="file" name="image" id="image" accept="image/*" >
            </div>

            <button>Partager la publication</button>
        </form>
    </main>
</template>

<style scoped>

    .main-publish {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px 20px 40px 20px;
        background-color: #f8f9fa;
        border-radius: 15px;
    }

    .main-publish h1 {
        font-size: 24px;
        margin-bottom: 24px;
        color: #333;
        text-align: center;
    }

    .main-publish form {
        background-color: white;
        border-radius: 8px;
        padding: 24px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .main-publish form div {
        margin-bottom: 20px;
    }

    .main-publish form div label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
    }

    .main-publish form div textarea {
        width: 95%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        resize: none;
        font-family: inherit;
        font-size: 16px;
        transition: border-color 0.3s;
    }

    .main-publish form div textarea:focus {
        border-color: #4285f4;
        outline: none;
    }

    .main-publish form div input[type="file"] {
        display: block;
        width: 100%;
        padding: 10px 0;
        font-size: 14px;
        color: #333;
    }

    .main-publish form div input[type="file"]::file-selector-button {
        padding: 8px 16px;
        background-color: #f0f2f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        color: #333;
        margin-right: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .main-publish form div input[type="file"]::file-selector-button:hover {
        background-color: #e4e6e9;
    }

    .main-publish form button {
        display: block;
        margin: 0 auto;
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s;
        min-width: 200px;
        text-align: center;
        margin-top: 50px;
        margin-bottom: 10px;
    }

    .main-publish form button:hover {
        background-color: #3367d6;
    }

    .form button:active {
        transform: scale(0.98);
    }

    .form button:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.4);
    }

</style>