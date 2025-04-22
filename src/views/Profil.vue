<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useAuth } from '@/components/Auth'
    import Header from '@/components/Header.vue'
    import { usePublicationActions } from '@/components/publicationActions'
    import { likeActions } from '@/components/likeActions'
    import { commentActions } from '@/components/commentActions'
    import {followActions} from '@/components/followActions'


    const router = useRouter()
    const route = useRoute()

    const { isAuthentificated, logout } = useAuth()
    const {bool_popup, bool_like, publicationDetail, seePublication} = usePublicationActions()
    const {Likes} = likeActions(bool_like, publicationDetail);
    const {bool_comments, allCommentsFromPost, newComment, Comments, addComments} = commentActions(publicationDetail)
    const {allFollowersOfUser, allFollowingsOfUser, showAbo, showAbo2, Followers, Followings} = followActions()

    const getUserIdFromLocalStorage = () => localStorage.getItem('userId') || '';

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

    interface PublicationDetail {
        owner: string;
        image: string;
        description: string;
        tags: string[];
        likes: string[];
        created_at: string;
        comments: Comment[];
    }

    interface Comment {
        user: string;
        text: string;
    }

    const publication = ref<Publication[]>([])
    const followings = ref<string[]>([])

    const bool = ref(false)
    const bool_following = ref(false)

    const statut = ref("")
    const statut_class = ref('')

    async function Follow(id: string){
        if(bool_following.value){
            const myId = {id: localStorage.getItem('userId')}
            
            const response = await fetch(`https://cda-api-eta.vercel.app/unfollow/${route.params.id}`, {
            // const response = await fetch(`http://localhost:3001/unfollow/${route.params.id}`, {
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
            
            const response = await fetch(`https://cda-api-eta.vercel.app/follow/${route.params.id}`, {
            // const response = await fetch(`http://localhost:3001/follow/${route.params.id}`, {
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

            console.log("data:", data)

            userData.value.id = data._id
            userData.value.username = data.username
            userData.value.bio = data.bio
            userData.value.profile_picture = data.profile_picture
            userData.value.followers = data.followers.length
            userData.value.following = data.following.length

            if(bool.value){
                
                const myInfo = await fetch(`https://cda-api-eta.vercel.app/user/${localStorage.getItem('userId')}`, {

                // const myInfo = await fetch(`http://localhost:3001/user/${localStorage.getItem('userId')}`, {
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
            
            const response = await fetch(`https://cda-api-eta.vercel.app/posts/user/${userId}`, {
            // const response = await fetch(`http://localhost:3001/posts/user/${userId}`, {
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
                image: pub.image,
                createdAt: pub.created_at,
                userId: pub.owner
            })).sort((a: Publication, b: Publication) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            console.log('publication:', publication.value)

        } catch(error){
            console.error('Error during onMounted fetching publication:', error)
        }

        const popUp = document.getElementById('DetailPost')
        document.addEventListener('keydown', (event) => {
            if(event.key === 'Escape'){
                bool_popup.value = false
                const test1Element = document.getElementById("test1");
                const test2Element = document.getElementById("test2");
                if (test1Element && test2Element) {
                    test1Element.style.filter = "blur(0)";
                    test2Element.style.filter = "blur(0)";
                }
                bool_comments.value = false

                showAbo.value = false
                showAbo2.value = false


            }
        })
        document.addEventListener('mousedown', (event) => {
            if (event.target) {
                if (event.target instanceof HTMLElement) {
                    // console.log(event.target.className)
                    if(event.target.className === "DetailPost"){
                        bool_popup.value = false
                        const test1Element = document.getElementById("test1");
                        const test2Element = document.getElementById("test2");
                        if (test1Element && test2Element) {
                            test1Element.style.filter = "blur(0)";
                            test2Element.style.filter = "blur(0)";
                        }
                        bool_comments.value = false
                    }

                    if(event.target.className === "div-abo"){
                        showAbo.value = false
                        showAbo2.value = false
                    }

                    if(event.target.className === "div-abo2"){
                        showAbo2.value = false
                        showAbo.value = false
                    }
                }
            }
            // if()
        })
    })


</script>

<template>

    <Header />

    <main class="main-profil" id="test1">
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
                <a :href="`/editProfil/${userData.id}`" class="edit-profil" >Modifier le profil</a>
                <span class="edit-profil" @click="logout">Se déconnecter</span>
            </div>
            <div class="div-follow">
                <div class="follow-content" @click="Followers(userData.id)"     >
                    <p>{{ userData.followers }}</p>
                    <p>Abonnés</p>
                </div>
                <div class="follow-content" @click="Followings(userData.id)">
                    <p>{{ userData.following }}</p>
                    <p>Abonnements</p>
                </div>
            </div>
        </div>
    </main>

    <div class="div-abo2" id="div-abo2" v-if="showAbo2 && allFollowersOfUser.length > 0">
        <section class="section-abonnements2">
            <h3>Abonnées: </h3>
            <div v-for="users in allFollowersOfUser" class="abonnements2">
                <a :href="`/profil/${users.id}`">
                    <img :src="users.profile_picture || '/public/utilisateur.png'" alt="Profile picture of user">
                    <p>{{ users.nameUser }}</p>
                </a>
            </div>
        </section>
    </div>


    <div class="div-abo" id="div-abo" v-if="showAbo && allFollowingsOfUser.length > 0">
        <section class="section-abonnements">
            <h3>Abonnements: </h3>
            <div v-for="userss in allFollowingsOfUser" class="abonnements">
                <a :href="`/profil/${userss.id}`">
                    <img :src="userss.profile_picture || '/public/utilisateur.png'" alt="Profile picture of user">
                    <p>{{ userss.nameUser }}</p>
                </a>
            </div>
        </section>
    </div>

    <section class="section-publication" id="test2" style="margin-bottom: 100px;">
        <div v-if="publication.length !== 0" class="div-publication">
            <div v-for="publications in publication" @click="seePublication(publications.id)" class="click">
                <img :src="publications.image" :alt="publications.description">
                <p>{{ publications.description }}</p>
            </div>
        </div>
    </section>

    <section class="DetailPost" id="DetailPost" v-if="bool_popup">
        <div class="DetailPostDiv">
            <div>
                <div class="userPart">
                    <img :src="userData.profile_picture || '/public/utilisateur.png'" alt="Profile picture of user" class="profil-user-detail">
                    <h3>{{ userData.username }}</h3>
                </div>
                <div class="main-content">
                    <img :src="publicationDetail.image" alt="" class="image-detail">
                </div>
                <div class="event-publications">
                    <div class="click-detail" @click="Likes(publicationDetail.id, getUserIdFromLocalStorage())">
                        <span class="span-detail" style="margin-right: 10px;">{{ publicationDetail.likes.length }}</span>
                        <img src="/public/like2.png" alt="Like" class="icon" width="30" v-if="bool_like">
                        <img src="/public/like.png" alt="Like" class="icon" width="30" v-if="!bool_like">
                    </div>
                    <div class="click-detail" @click="Comments(publicationDetail.id, false)">
                        <span class="span-detail" style="margin-right: 10px;">{{ publicationDetail.comments.length }}</span>
                        <img src="/public/commenter.png" alt="Comment" class="icon" width="30">
                    </div>
                </div>  
                <div class="description">
                    <p>{{ publicationDetail.description }}</p>
                    <div class="test">
                        <p class="tags" v-for="tags in publicationDetail.tags">{{ tags }} </p>
                    </div>
                </div>
            </div>
            <div class="comments-part" v-if="bool_comments">
                <h3>Commentaires</h3>
                <div v-for="comments in allCommentsFromPost" :key="comments.created_at" class="border-comment">
                    <div class="info-user-comment">
                        <img :src="comments.profile_picture" alt="User profil picture">
                        <p>{{ comments.user }}</p>
                    </div>
                    <p class="user-comment-content">{{ comments.text }}</p>
                </div>

                <div class="AddComment">
                    <input type="text" placeholder="Ajouter un commentaire ..." v-model="newComment">
                    <img src="/public/send.png" alt="Send comment" @click="addComments(publicationDetail.id, userData.id, newComment)">
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    @import '../assets/profil.css';
</style>