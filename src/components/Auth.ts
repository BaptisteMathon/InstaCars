import { useRouter} from 'vue-router'

export function useAuth(){
    const router = useRouter()

    const isAuthentificated = () => {
        console.log('isAuthentificated', localStorage.getItem('token') )
        return localStorage.getItem('token') !== null
    }

    const logout = async () => {
        try{
            const logout = await fetch('https://cda-api-eta.vercel.app/api/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            if (!logout.ok) {
                throw new Error('Erreur lors de la déconnexion')
            }
            const data = await logout.json()
            if(data.message){
                localStorage.removeItem('token')
                router.push('/auth')
            } 
        } catch(error){
            console.error('Erreur lors de la déconnexion:', error)
        }
    }

    const isAdmin = async (id:string) => {
        try{
            const response = await fetch(`https://cda-api-eta.vercel.app/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token') || ''
                }

            })

            if(!response.ok) {
                throw new Error('Erreur lors de la vérification de l\'admin')
            }
            const data = await response.json()

            return data.is_verified
        } catch(error){
            console.error('Erreur lors de la vérification de l\'admin', error)
        }
    }

    return {
        isAuthentificated,
        logout,
        isAdmin
    }
}

