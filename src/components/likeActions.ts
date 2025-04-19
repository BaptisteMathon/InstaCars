import {type Ref} from 'vue'

export function likeActions(bool_like: Ref<boolean>, publicationDetail: Ref){
    async function Likes(idPost: string, idUser: string ){
        console.log("idPost: ", idPost)
        console.log("idUser: ", idUser)
        if(bool_like.value){
            // console.log("déjà liké")
            const removeLike = await fetch (`http://localhost:3001/post/unlike/${idPost}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idUser})
            })

            const data = await removeLike.json()

            if(!removeLike){
                console.error('Error fetch for unlike')
            } else {
                console.log(data)
                bool_like.value = false
                publicationDetail.value.likes.length -= 1
            }
        } else {
            // console.log("pas encore liké")
            const addLike = await fetch (`http://localhost:3001/post/like/${idPost}`, {
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
                console.log(data)
                bool_like.value = true
                publicationDetail.value.likes.length += 1
            }
        }


    }

    return {
        Likes
    }
}