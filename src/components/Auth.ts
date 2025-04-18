import { useRouter} from 'vue-router'

export function useAuth(){
    const router = useRouter()

    const isAuthentificated = () => {
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

    return {
        isAuthentificated,
        logout
    }
}

