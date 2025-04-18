<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useAuth } from '@/components/Auth'
    import Header from '@/components/Header.vue'

    const router = useRouter()
    const route = useRoute()

    const { isAuthentificated, logout } = useAuth()

    const userData = ref({
        id: '',
        username: '',
        bio: '',
        profile_picture: '',
        followers: 0,
        following: 0
    })

    interface Publication {
        id: string
        description: string
        image: string
        createdAt: string
        userId: string
    }

    const publication = ref<Publication[]>([])
    const followings = ref<string[]>([])

    const bool = ref(false)
    const bool_following = ref(false)

    const statut = ref("")
    const statut_class = ref('')

    async function Follow(id: string){
        console.log(followings.value)
        if(bool_following.value){
            const myId = {id: localStorage.getItem('userId')}
            const response = await fetch(`http://localhost:3001/unfollow/${route.params.id}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myId)
            })
            const data = await response.json()
            
            if (!response.ok) {
                console.error('Erreur HTTP:', response.status, data)
            } else {
                console.log('Unfollow réussi:', data)
                statut.value = "S'abonner"
                statut_class.value = "follow"
                bool_following.value = false

                userData.value.followers -= 1
            }
        } else{
            console.log("follow!!!")
            const myId = {id: localStorage.getItem('userId')}
            const response = await fetch(`http://localhost:3001/follow/${route.params.id}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myId)
            })

            const data = await response.json()

            if(!response.ok){
                console.error('Erreur HTTP: ', response.status, data)
            } else {
                console.log('Follow réussi: ', data)
                statut.value = "Se désabonner"
                statut_class.value = "unfollow"
                bool_following.value = true
                
                userData.value.followers += 1

            }
        }
        console.log("id du bg: ", id)
        return 
    }

    onMounted(async () => {
        if (!isAuthentificated()) {
            router.push('/auth')
        }

        // let bool = false;
        let userId = ''

        if(route.params.id && route.params.id !== localStorage.getItem('userId')){
            bool.value = true
            userId = route.params.id as string
        } else{
            userId = localStorage.getItem('userId') || ''
        }

        console.log("userId:", userId)

        try{
    
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

            console.log("data:", data)

            userData.value.id = data._id
            userData.value.username = data.username
            userData.value.bio = data.bio
            userData.value.profile_picture = `http://localhost:3001/uploads/profil_pictures/${data.profile_picture}`
            userData.value.followers = data.followers.length
            userData.value.following = data.following.length

            if(bool.value){
                const myInfo = await fetch(`http://localhost:3001/user/${localStorage.getItem('userId')}`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': localStorage.getItem('token') || '',
                    }
                })

                const myData = await myInfo.json()
                if(myData.following.includes(userId)){
                    statut.value = "Se désabonner"
                    statut_class.value = "unfollow"
                    bool_following.value = true
                    followings.value = myData.following
                } else {
                    statut.value = "S'abonner"
                    statut_class.value = "follow"
                    bool_following.value = false
                }
                console.log(myData.following)
            }

        } catch(error){
            console.error('Error during onMounted fetching user:', error)
        }

        try{
            const response = await fetch(`http://localhost:3001/posts/user/${userId}`, {
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


            publication.value = data.map((pub: any) => ({
                id: pub._id,
                description: pub.description,
                image: `http://localhost:3001/uploads/publications/${pub.image}`,
                createdAt: pub.created_at,
                userId: pub.owner
            }))

            console.log('publication:', publication.value)

        } catch(error){
            console.error('Error during onMounted fetching publication:', error)
        }
    })


</script>

<template>

    <Header />

    <main class="main-profil">
        <div class="main-div1">
            <img :src="userData.profile_picture || '/public/utilisateur.png'" alt="" width="150" height="150">
            <div>
                <h2>{{ userData.username }}</h2>
                <div class="bio">
                    {{ userData.bio }}
                </div>
                <div v-if="bool" :class="statut_class">
                    <span @click="Follow(userData.id)" >{{ statut }}</span>
                </div>
            </div>
        </div>

        <div class="main-div2">
            <div v-if="!bool">
                <span class="edit-profil">Modifier le profil</span>
                <span class="edit-profil" @click="logout">Se déconnecter</span>
            </div>
            <div class="div-follow">
                <div>
                    <p>{{ userData.followers }}</p>
                    <p>Abonnés</p>
                </div>
                <div>
                    <p>{{ userData.following }}</p>
                    <p>Abonnements</p>
                </div>
            </div>
        </div>
    </main>

    <section class="section-publication">
        <div v-if="publication.length !== 0" class="div-publication">
            <div v-for="publications in publication">
                <img :src="publications.image" :alt="publications.description">
                <p>{{ publications.description }}</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
    @import '../assets/profil.css';
</style>