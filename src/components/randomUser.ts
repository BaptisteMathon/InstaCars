import {ref} from 'vue'

export function randomUser(){
 
    async function getRandomUser() {
        try{    
            const allUsers = await fetch(`https://cda-api-eta.vercel.app/users`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                }
            })

            const data = await allUsers.json()
            if(!allUsers.ok){
                console.error('Erreur lors du get fetch random user')
            }

            const allUsersLength = data.length
            // const randomIndex = Math.floor(Math.random() * allUsersLength)

            const randomUsers: any[] = []
            let countRandomUser = 0

            const infoCurrentUser = await fetch(`https://cda-api-eta.vercel.app/user/${localStorage.getItem('userId')}`, {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token') || '',
                    'Content-Type': 'application/json'
                }
            })

            const dataCurrentUser = await infoCurrentUser.json()
            if(!infoCurrentUser.ok){
                console.error('Erreur lors du get fetch random user')
            }

            console.log('dataCurrentUser', dataCurrentUser.following)

            while(countRandomUser < 3){
                const randomIndex = Math.floor(Math.random() * allUsersLength)
                const tryRandomUser = data[randomIndex]
                if(!randomUsers.includes(tryRandomUser) && (tryRandomUser._id !== localStorage.getItem('userId')) && !dataCurrentUser.following.includes(tryRandomUser._id)){
                    randomUsers.push(tryRandomUser)
                    countRandomUser++
                }
            }
            console.log('allUsers', data)
            console.log('randomUsers', randomUsers)
            return randomUsers
        } catch(err){
            console.error('Erreur lors du get fetch random user')
            return
        }
    }

    return {
        getRandomUser
    }
}