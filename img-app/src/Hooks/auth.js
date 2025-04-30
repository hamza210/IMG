import {onAuthStateChanged,getAuth} from 'firebase/auth'
import '../firebase.config'
import { useEffect, useRef, useState } from 'react'

export const useAuth = () => {
    const auths = getAuth()
    const isMounted = useRef(true)
    const [login,setlogin] = useState(false)
    useEffect(() => {
        onAuthStateChanged(auths,(user) => {
            if(user){
                setlogin(true)
            }else{
                setlogin(false)
                
            }
          })
    },[isMounted])
  return {login}
}


