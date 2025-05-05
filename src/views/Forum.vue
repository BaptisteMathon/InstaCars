<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuth } from '@/components/Auth';
    import Header from '@/components/Header.vue';

    const router = useRouter();
    const { isAuthentificated } = useAuth();

    interface forumStructure {
        _id: string,
        forumName: string,
        description: string,
        created_at: string,
        forumOwner: string
        OwnerUsername: string
    }

    const forums = ref<forumStructure[]>([])
    const forumName = ref<string>('');
    const forumDescription = ref<string>('');
    const searchForum = ref<string>('');
    const bool_newForum = ref<boolean>(false)

    const filteredForum = computed(() => {
        if(searchForum.value === ""){
            forums.value
        }
        return forums.value.filter(form => 
            form.forumName.toLowerCase().startsWith(searchForum.value.toLowerCase())
        )
    })

    const userID = localStorage.getItem('userId')

    onMounted(async () => {
        if (!isAuthentificated()) {
            router.push('/auth');
        }

        await loadForum()

        document.addEventListener('keydown', (event) => {
            if(event.key === 'Escape'){
                bool_newForum.value = false
            }
        })

        document.addEventListener('mousedown', (event) => {
            if(event.target){
                if(event.target instanceof HTMLElement){
                    console.log(event.target.className)
                    if(event.target.className === "section-new-forum"){
                        bool_newForum.value = false
                    }
                }
            }
        })

        document.title = "InstaCars | Forum"
    });

    async function loadForum() {
        try {
            const response = await fetch(`http://localhost:3001/allForums`, {
            // const response = await fetch(`https://cda-api-eta.vercel.app/allForums`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                },
            });

            if (!response.ok) {
                console.error("Erreur lors du fetch");
                return;
            }

            const data = await response.json();

            const forumAllDetail = await Promise.all(
                data.map(async (forum: forumStructure) => {
                    try{
                        const response = await fetch(`http://localhost:3001/user/${forum.forumOwner}`, {
                            method: 'GET',
                            headers: {
                                'x-access-token': localStorage.getItem('token') || '',
                            },
                        })

                        const userData = await response.json();

                        const date = new Date(forum.created_at);
                        console.log({date});

                        forum.created_at = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                        forum.OwnerUsername = userData.username;

                        return forum

                    } catch(error) {
                        console.error('Error during fetch user:', error);
                    }
                })
            )

            forums.value = forumAllDetail;
            console.log(forums);
        } catch (error) {
            console.error('Error during onMounted:', error);
        }
    }

    async function addForum(){
        console.log("Forum name: ", forumName.value);
        console.log("Forum description: ", forumDescription.value);
        console.log("Forum owner: ", localStorage.getItem('userId'));

        try{
            const response = await fetch(`http://localhost:3001/forum`, {
            // const response = await fetch(`https://cda-api-eta.vercel.app/forum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token') || '',
                },
                body: JSON.stringify({
                    forumName: forumName.value,
                    description: forumDescription.value,
                    forumOwner: localStorage.getItem('userId'),
                }),
            });

            if (!response.ok) {
                console.error("Erreur lors du fetch");
                return;
            }

            await loadForum();
            forumName.value = '';
            forumDescription.value = '';
            bool_newForum.value = false
        } catch(error) {
            console.error('Error during addForum:', error);
            return;
        }
    }

    async function deleteForum(id: string){
        console.log("Forum id: ", id);

        try{
            const response = await fetch(`http://localhost:3001/forum/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                },
            });

            if (!response.ok) {
                console.error("Erreur lors du fetch");
                return;
            }

            await loadForum();
        } catch(error) {
            console.error('Error during deleteForum:', error);
        }
    }
</script>

<template>
    <Header />
    <main>

        <div>
            <button class="newForum" @click="bool_newForum = !bool_newForum">
                <img src="/public/add.png" alt="" width="25px" height="25px">
                Créer un forum
            </button>
        </div>

        <div class="h1">
            <h1>Forum</h1>
            <input type="text" v-model="searchForum" placeholder="Rechercher un forum" class="searchForum"/>
        </div>

        <section class="section-forum">
            <div v-for="forum in filteredForum" class="forum-container">
                <a :href="`/forum/${forum._id}`">
                    <div class="forum">
                        <h2>{{ forum.forumName }}</h2>
                        <p class="description">Description: {{ forum.description }}</p>
                        <p>Créé le : {{ forum.created_at }}</p>
                        <p>Créé par : {{ forum.OwnerUsername }}</p>
                    </div>
                </a>
                <span v-if="forum.forumOwner === userID" class="deleteForum" @click="deleteForum(forum._id)"><img src="/public/trash.png" alt="" width="25"></span>
            </div>
        </section>
    </main>

    <section class="section-new-forum" v-if="bool_newForum">
        <div>
            <h2>Créer un nouveau forum</h2>
            <form class="form-forum">
                <label for="forumName">Nom du forum :</label>
                <input type="text" id="forumName" name="forumName" required v-model="forumName" />
    
                <label for="description">Description :</label>
                <textarea id="description" name="description" required v-model="forumDescription"></textarea>
    
                <button @click.prevent="addForum" class="create-forum">Créer le forum</button>
            </form>
        </div>
    </section>
</template>

<style scoped>
    @import '../assets/forum.css';
</style>