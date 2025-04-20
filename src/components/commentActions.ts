import {ref, type Ref} from 'vue'

export function commentActions (publicationDetail: Ref){

    interface Comment {
        user: string,
        profile_picture: string,
        text: string,
        created_at: string
    }

    const bool_comments = ref(false)
    const allCommentsFromPost = ref<Comment[]>([])
    const newComment = ref('')


    async function Comments(idPublication: string, test: boolean){
        if(bool_comments.value && !test){
            bool_comments.value = false
            console.log("fermeture")
        } else {
            bool_comments.value = true

            try{
                const allComments = await fetch(`http://localhost:3001/comments/${idPublication}`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': localStorage.getItem('token') || '',
                        'Content-Type': 'application/json'
                    }
                })

                const data = await allComments.json()

                if(!allComments.ok){
                    console.error('Erreur lors du get fetch comments')
                } 
                const enrichedComments = await Promise.all(
                    data.map(async (comment: Comment) => {
                      try {
                        const userResponse = await fetch(`http://localhost:3001/user/${comment.user}`, {
                          headers: {
                            'x-access-token': localStorage.getItem('token') || ''
                          }
                        })
                        const userData = await userResponse.json()
                        return {
                          ...comment,
                          user: userData.username || 'Utilisateur inconnu',
                          profile_picture: userData.profile_picture ? `http://localhost:3001/uploads/profil_pictures/${userData.profile_picture}` : null
                        }
                      } catch (err) {
                        console.error(`Erreur lors du fetch de l'utilisateur ${comment.user}`, err)
                        return {
                          ...comment,
                          user: 'Utilisateur inconnu',
                          profile_picture: null
                        }
                      }
                    })
                  )
              
                  allCommentsFromPost.value = enrichedComments
            } catch(err){
                console.error('Error on fetch to get all comments', err)
            }


        }
    }

    async function addComments(idPost: string, idUser: string, comment: string){
        try{
            const tempJSON = {
                idUser: localStorage.getItem('userId'),
                comment
            }

            const addComments = await fetch(`http://localhost:3001/post/comment/${idPost}`, {
                method: 'PUT',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempJSON)
            })

            const data = await addComments.json()

            if(!addComments.ok){
                console.error('Erreur lros du put pour ajouter un commentaire')
            } else {
                console.log(data)
                Comments(idPost, true)
                newComment.value = ''
                publicationDetail.value.comments.length += 1
            }
        } catch(err){
            console.error('Error on fetch PUT to adding comment', err)
        }
    }

    return {
        bool_comments,
        allCommentsFromPost,
        newComment,
        Comments,
        addComments
    }
}

