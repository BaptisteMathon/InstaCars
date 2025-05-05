<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useAuth } from '@/components/Auth';
    import Header from '@/components/Header.vue';

    const router = useRouter();
    const route = useRoute();
    const forumId = route.params.id;
    const { isAuthentificated } = useAuth();

    interface messageStructure {
        _id: string,
        user: string,
        message: string,
        profile_picture: string,
        idUser: string,
    }

    interface forumStructure {
        _id: string,
        forumName: string,
        description: string,
        created_at: string,
        forumOwner: string,
        // idUser: string,
    }

    const forumInfo = ref<forumStructure | null>(null);
    const allMessage = ref<messageStructure[]>([]);
    const newMessage = ref<string>('');
    const nameUserconnected = ref<string>('');

    onMounted(async () => {
        if (!isAuthentificated()) {
            router.push('/auth');
        }

        console.log('connecté')

        await loadMessage();

        const userConnectedInfo = await fetch(`http://localhost:3001/user/${localStorage.getItem('userId')}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token') || '',
            },
        })

        const userConnectedData = await userConnectedInfo.json();
        nameUserconnected.value = userConnectedData.username;
        // console.log(nameUserconnected.value);

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

        document.title = "InstaCars | Forum: " + forumInfo.value?.forumName;
    });

    async function loadMessage() {
        try {
            const response = await fetch(`http://localhost:3001/forum/${forumId}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                },
            });
            
            const data = await response.json();

            if (!response.ok) {
                console.error("Erreur lors du fetch");
                return;
            } else {
                await Promise.all(
                    data.forumContent.map(async (message: messageStructure) => {
                        const userResponse = await fetch(`http://localhost:3001/user/${message.user}`, {
                            method: 'GET',
                            headers: {
                                'x-access-token': localStorage.getItem('token') || '',
                            },
                        });

                        const userData = await userResponse.json();
                        message.user = userData.username;
                        message.profile_picture = userData.profile_picture;
                        message.idUser = userData._id;
                        return message;
                    })
                )
            }

            allMessage.value = data.forumContent;
            forumInfo.value = data as forumStructure;
            console.log(allMessage);
            console.log(forumInfo);
        } catch (error) {
            console.error('Error during onMounted:', error);
        }
    }

    async function sendMessage() {
        console.log("Forum id: ", forumId);
        console.log("Message: ", newMessage.value);
        console.log("User id: ", localStorage.getItem('userId'));

        try {
            const response = await fetch(`http://localhost:3001/newMessage/${forumId}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: localStorage.getItem('userId'),
                    message: newMessage.value,
                }),
            });

            if (!response.ok) {
                console.error("Erreur lors du fetch");
                return;
            }

            newMessage.value = '';
            await loadMessage();
        } catch (error) {
            console.error('Error during onMounted:', error);
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }

    async function deleteMessage(messageId: string) {
        // console.log("Message id: ", messageId);

        try {
            const response = await fetch(`http://localhost:3001/deleteMessage/${forumId}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idMessage: messageId,
                }),
            });

            if (!response.ok) {
                console.error("Erreur lors du fetch");
                return;
            }

            await loadMessage();
        } catch (error) {
            console.error('Error during onMounted:', error);
        }
    }
</script>

<template>
    <Header />

    <main>
        <div class="div-h1">
            <h1>{{ forumInfo?.forumName }}</h1>
        </div>            

        <section>
            <div class="all-message">
                <div v-for="message in allMessage" :class="nameUserconnected === message.user ? 'message' : 'message2'">
                    <div class="message-header">
                        <a :href="`/profil/${message.idUser}`">
                            <img :src="message.profile_picture" alt="" width="50" height="50" class="profile-picture">
                        </a>
                        <img src="/public/trash.png" alt="" width="24" height="24" v-if="nameUserconnected === message.user" @click="deleteMessage(message._id)" class="delete-message">
                    </div>
                        <!-- <h2>{{ message.user }}</h2> -->
                    <p class="message-content">{{ message.message }}</p>
                </div>
            </div>

            <div class="sendMessage">
                <input type="text" placeholder="Votre message" v-model="newMessage" @keyup.enter="sendMessage" />
                <img src="/public/send.png" alt="" @click="sendMessage">
            </div>
        </section>
    </main>
</template>

<style scoped>
    @import "../assets/forumDetail.css";
</style>