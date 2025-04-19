
import { ref } from 'vue';
import { useRoute } from 'vue-router';

interface PublicationDetail {
    id: string;
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

export function usePublicationActions() {
    const route = useRoute();
    const bool_popup = ref(false);
    const bool_like = ref(false);
    const publicationDetail = ref<PublicationDetail>({
        id: "",
        owner: "",
        image: "",
        description: "",
        tags: [],
        likes: [],
        created_at: "",
        comments: []
    });

    async function seePublication(idOfPublication: string) {
        console.log("cliqué sur la publication: ", idOfPublication);
        bool_popup.value = true;
        const test1Element = document.getElementById("test1");
        const test2Element = document.getElementById("test2");
        if (test1Element && test2Element) {
            test1Element.style.filter = "blur(4px)";
            test2Element.style.filter = "blur(4px)";
        }

        const postDetail = await fetch(`http://localhost:3001/post/${idOfPublication}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token') || '',
                'Content-Type': 'application/json'
            }
        });

        const data = await postDetail.json();

        if(!postDetail.ok) {
            console.error('Erreur fetch post detail: ', postDetail.status, data);
        } else {
            console.log(data);

            publicationDetail.value = {
                id: data._id,
                owner: data.owner,
                image: `http://localhost:3001/uploads/publications/${data.image}`,
                description: data.description,
                tags: data.tags,
                likes: data.likes,
                created_at: data.created_at,
                comments: data.comments
            };

            if(publicationDetail.value.likes.includes(localStorage.getItem('userId') || '')) {
                bool_like.value = true;
            } else {
                bool_like.value = false;
            }
        }
    }

    return {
        bool_popup,
        bool_like,
        publicationDetail,
        seePublication
    };
}