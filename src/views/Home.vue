<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuth } from '@/components/Auth'
    import Header from '@/components/Header.vue'


    const router = useRouter()
    const { isAuthentificated } = useAuth()

    const userID = ref('')

    interface Comments {
        user: string,
        text: string,
    }

    interface infoPosts {
        idPost: string,
        idUserPost: string,
        image: string,
        description: string,
        tags: string[],
        likes: string[],
        created_at: string,
        comments: Comments[],
        user_like : boolean,
        username: string,
        profile_picture: string,
    }

    interface CommentsDetail {
        user: string,
        text: string,
        username: string,
        profile_picture: string,
    }

    const allCommentsDetail = ref<CommentsDetail[]>([])
    const details = ref('')
    const allPost = ref<infoPosts[]>([])
    const boolComments = ref(false)
    const newComment = ref('')

    async function Like(idPost: string, idUser: string){
        // const addLike = await fetch (`http://localhost:3001/post/like/${idPost}`, {
        const addLike = await fetch (`https://cda-api-eta.vercel.app/post/like/${idPost}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idUser})
            })

            const data = await addLike.json()

            if(!addLike){
                console.error('Error fetch for like')
            } else {
                await loadHome()
            }
    }

    async function Unlike(idPost: string, idUser: string){
        const addLike = await fetch (`https://cda-api-eta.vercel.app/post/unlike/${idPost}`, {
        // const addLike = await fetch (`http://localhost:3001/post/unlike/${idPost}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idUser})
            })

            const data = await addLike.json()

            if(!addLike){
                console.error('Error fetch for unlike')
            } else {
                await loadHome()
            }
    }

    async function comments(idPost: string){
        console.log(idPost)
        const allComments = await fetch(`https://cda-api-eta.vercel.app/post/${idPost}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token') || '',
                'Content-Type': 'application/json'
            }
        })

        const data = await allComments.json()

        if(!allComments.ok){
            console.error('Erreur lors du fetch info post')
            return
        } else {
            console.log(data)

            const commentsInfoUser = await Promise.all(
                data.comments.map(async (detail: any) => {
                    const response = await fetch(`https://cda-api-eta.vercel.app/user/${detail.user}`, {
                        method: 'GET',
                        headers: {
                            'x-access-token': localStorage.getItem('token') || ''
                        }
                    })

                    const result = await response.json()

                    console.log(result)

                    return {
                        user: detail.user,
                        text: detail.text,
                        username: result.username,
                        profile_picture: result.profile_picture
                    }
                })
            )

            allCommentsDetail.value = commentsInfoUser
            console.log("allCommentsDetail: ", allCommentsDetail)
            boolComments.value = true
            details.value = data._id
            console.log("details: ", details)
        }
    }

    async function addComments(idPost: string, idUser: string, comment: string){
        console.log("idPost: ", idPost)
        console.log("idUser: ", idUser)
        console.log("comment: ", comment)

        const tempJSON = {
            idUser,
            comment
        }

        const addComment = await fetch(`https://cda-api-eta.vercel.app/post/comment/${idPost}`, {
            method: 'PUT',
            headers: {
                'x-access-token': localStorage.getItem('token') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempJSON)
        })

        const data = await addComment.json()

        if(!addComment.ok){
            console.error("Erreur lors du put pour l'ajout d'un commentaire")
            return
        } else {
            comments(idPost)
            newComment.value = ''
            loadHome()
        }
    }

    onMounted(async() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if(token){
            const payload = JSON.parse(atob(token.split('.')[1]))
            console.log(payload)
            const userId = payload.id

            localStorage.setItem('token', token)
            localStorage.setItem('userId', userId)

            window.location.href = '/'
        }

        if(!isAuthentificated()){
            router.push('/auth')
        } 

        userID.value = localStorage.getItem('userId') || ''

        await loadHome()     
        
        document.addEventListener('keydown', (event) => {
            if(event.key === 'Escape'){
                boolComments.value = false
            }
        })

        document.addEventListener('mousedown', (event) => {
            if(event.target){
                if(event.target instanceof HTMLElement){
                    console.log(event.target.className)
                    if(event.target.className === "section-commentaire"){
                        boolComments.value = false
                    }
                }
            }
        })
    })

    async function loadHome(){
            try {
                // const response = await fetch(`http://localhost:3001/allFollowings/${userID.value}`, {
                const response = await fetch(`https://cda-api-eta.vercel.app/allFollowings/${userID.value}`, {

                    method: 'GET',
                    headers: {
                        'x-access-token': localStorage.getItem('token') || '',
                        'Content-Type': 'application/json'
                    }
                })
    
                const data = await response.json()
                console.log("data: ", data)
    
                if(!response.ok){
                    console.error('Erreur lors du fetch de la récupération des abbonées: ')
                    return 
                } 
    
                const enrichedPost = await Promise.all(
                    data.map(async (posts: infoPosts) => {
                        try{
                            
                            const postResponse = await fetch(`https://cda-api-eta.vercel.app/posts/user/${posts}`, {
                            // const postResponse = await fetch(`http://localhost:3001/posts/user/${posts}`, {
                                method: 'GET',
                                headers: {
                                    'x-access-token': localStorage.getItem('token') || ''
                                }
                            })
                            const postData = await postResponse.json()
                            console.log("postData: ", postData)
    
                            // return {
                            //     idPost: postData._id,
                            //     idUserPost: postData.owner,
                            //     image: postData.image,
                            //     description: postData.description,
                            //     tags: postData.tags,
                            //     likes: postData.likes,
                            //     created_at: postData.created_at,
                            //     comments: postData.comments 
                            // }
                            // return postData.map((post: any) => ({
                            //     idPost: post._id,
                            //     idUserPost: post.owner,
                            //     image: post.image,
                            //     description: post.description,
                            //     tags: post.tags,
                            //     likes: post.likes,
                            //     created_at: post.created_at,
                            //     comments: post.comments,
                            //     user_like: post.likes.includes(userID.value) ? true : false
                            // }))

                            const test = await Promise.all(
                                postData.map(async (post: any) => {
                                    
                                    const userResponse = await fetch(`https://cda-api-eta.vercel.app/user/${post.owner}`, {
                                // const userResponse = await fetch(`http://localhost:3001/user/${post.owner}`, {
                                        method: 'GET',
                                        headers: {
                                        'x-access-token': localStorage.getItem('token') || ''
                                        }
                                    })

                                    const userData = await userResponse.json()

                                    console.log("userData: ", userData)
                                    console.log("description: ", post.description)

                                    return {
                                        idPost: post._id,
                                        idUserPost: post.owner,
                                        image: post.image,
                                        description: post.description,
                                        tags: post.tags,
                                        likes: post.likes,
                                        created_at: post.created_at,
                                        comments: post.comments,
                                        user_like: post.likes.includes(userID.value),
                                        username: userData.username,
                                        profile_picture: userData.profile_picture
                                    }
                                })
                            )

                            console.log("test: ", test)

                            return test
    
                        } catch(err){
                            console.error('Erreur lors du fetch utilisateur')
                            // return {
                            //     // ...user,
                            //     idPost: '',
                            //     idUserPost: '',
                            //     image: '',
                            //     description: '',
                            //     tags: [],
                            //     likes: [],
                            //     created_at: '',
                            //     comments: []
                            // }
                            return [{
                                idPost: '',
                                idUserPost: '',
                                image: '',
                                description: '',
                                tags: [],
                                likes: [],
                                created_at: '',
                                comments: [],
                                user_like: false,
                            }]
                        }
                    })
                )

                console.log("enrichedPost: ", enrichedPost)
    

                allPost.value = enrichedPost
                // const sortPosts = allPost.value.flat()
                const sortPosts = allPost.value.flat().sort((a, b) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })
                // console.log('allPost: ', sortPosts[0].description)
                // console.log('allPost: ', sortPosts)
                allPost.value = sortPosts
    
                
    
                console.log(data)
            } catch(err){
                console.error('Erreur lors du fetch principal')
            }

        }
</script>

<template>
    <Header />

    <main style="padding-bottom: 50px;">
        <section v-for="posts in allPost" class="publications-home">
            <div>
                <div class="user-info">
                    <a :href="`/profil/${posts.idUserPost}`">
                        <img :src="`${posts.profile_picture}`" alt="" width="50" height="50">
                        <p>{{ posts.username }}</p>
                    </a>
                </div>
                <div>
                    <video controls class="home-post" v-if="posts.image.includes('/video/')">
                        <source :src="posts.image" type="video/mp4">
                        Le navigateur ne supporte pas la vidéo
                    </video>
                    <img :src="`${posts.image}`" alt="Publication" class="home-post" v-else>
                    <p>{{ posts.description }}</p>
                    <span v-for="tags in posts.tags" class="tags">{{ tags }}</span>
                    <div class="interact">
                        <div>
                            <span class="span-detail" style="margin-right: 10px;">{{ posts.likes.length }}</span>
                            <img src="/public/like2.png" alt="Like" width="30" v-if="posts.user_like" @click="Unlike(posts.idPost, userID)">
                            <img src="/public/like.png" alt="Like" width="30" v-if="!posts.user_like" @click="Like(posts.idPost, userID)">
                        </div>
                        <div @click="comments(posts.idPost)">
                            <span class="span-detail" style="margin-right: 10px">{{ posts.comments.length }}</span>
                            <img src="/public/commenter.png" alt="Comment" width="30">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section-commentaire" v-if="boolComments">
            <div class="div-commentaire">
                <h3>Commentaires: </h3>
                <div v-for="comments in allCommentsDetail" :key="comments.user" class="commentsDetail">
                    <a :href="`/profil/${comments.user}`">
                        <img :src="comments.profile_picture" alt="User profil picture">
                        <p>{{ comments.username }}</p>
                    </a>
                    <p>{{ comments.text }}</p>
                </div>
                <div class="AddComment">
                    <input type="text" placeholder="Ajouter un commentaire ..." v-model="newComment">
                    <img src="/public/send.png" alt="Send comment" @click="details && addComments(details, userID, newComment)">
                </div>
            </div>
        </section>
    </main>
</template>

<style scoped>
    @import '../assets/home.css'
</style>