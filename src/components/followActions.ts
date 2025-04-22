import {ref} from 'vue'

export function followActions(){

    interface Users {
        id: string,
        nameUser: string,
        profile_picture: string,
    }

    const allFollowersOfUser = ref<Users[]>([])
    const allFollowingsOfUser = ref<Users[]>([])

    const showAbo = ref(false)
    const showAbo2 = ref(false)

    async function Followers(id: string){
        console.log("Followers")
        try{
            
            const allFollowers = await fetch(`https://cda-api-eta.vercel.app/allFollowers/${id}`, {

            // const allFollowers = await fetch(`http://localhost:3001/allFollowers/${id}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                }
            })

            const data = await allFollowers.json()

            if(!allFollowers.ok){
                console.error('Erreur lors du fetch get')
                return
            }

            // console.log("data: ", data)

            const enrichedUsers = await Promise.all(
                data.map(async (user: Users) => {
                    try{
                        
                        const userResponse = await fetch(`https://cda-api-eta.vercel.app/user/${user}`, {

                        // const userResponse = await fetch(`http://localhost:3001/user/${user}`, {
                            method: 'GET',
                            headers: {
                              'x-access-token': localStorage.getItem('token') || ''
                            }
                          })
                          const userData = await userResponse.json()
                          return {
                            // ...user,
                            id: userData._id,
                            nameUser: userData.username,
                            profile_picture: userData.profile_picture ? userData.profile_picture : null
                          }
                    } catch(error){
                        console.error('Erreur lors du fetch utilisateur')
                        return {
                            // ...user,
                            id: '',
                            nameUser: '',
                            profile_picture: ''
                        }
                    }
                })
            )

            allFollowersOfUser.value = enrichedUsers
            console.log("allFollowersOfUser: ", allFollowersOfUser.value)
            showAbo2.value = true


        } catch(error){
            console.error('Error on GET fetch')
        }
    }


    async function Followings(id: string){
        console.log("Followings")
        try{
            
            const allFollowings = await fetch(`https://cda-api-eta.vercel.app/allFollowings/${id}`, {

            // const allFollowings = await fetch(`http://localhost:3001/allFollowings/${id}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                }
            })

            const data = await allFollowings.json()

            if(!allFollowings.ok){
                console.error('Erreur lors du fetch get')
                return
            }

            // console.log("data: ", data)

            const enrichedUsers = await Promise.all(
                data.map(async (user: Users) => {
                    try{
                        
                        const userResponse = await fetch(`https://cda-api-eta.vercel.app/user/${user}`, {

                        // const userResponse = await fetch(`http://localhost:3001/user/${user}`, {
                            headers: {
                              'x-access-token': localStorage.getItem('token') || ''
                            }
                          })
                          const userData = await userResponse.json()
                          return {
                            // ...user,
                            id: userData._id,
                            nameUser: userData.username,
                            profile_picture: userData.profile_picture ? userData.profile_picture : null
                          }
                    } catch(error){
                        console.error('Erreur lors du fetch utilisateur')
                        return {
                            // ...user,
                            id: '',
                            nameUser: '',
                            profile_picture: ''
                        }
                    }
                })
            )

            allFollowingsOfUser.value = enrichedUsers
            console.log("allFollowersOfUser: ", allFollowingsOfUser.value)
            showAbo.value = true
            showAbo2.value = false

        } catch(error){
            console.error('Error on GET fetch')
        }
    }

    return {
        Followers,
        Followings,
        allFollowersOfUser,
        allFollowingsOfUser,
        showAbo,
        showAbo2
    }
}