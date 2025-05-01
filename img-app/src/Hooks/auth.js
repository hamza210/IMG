import {onAuthStateChanged,getAuth} from 'firebase/auth'
import '../firebase.config'
import { useEffect, useRef, useState } from 'react'

export const useAuth = () => {
    const auths = getAuth()
    const isMounted = useRef(true)
    const [login,setlogin] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)
    useEffect(() => {
        if(isMounted){
            onAuthStateChanged(auths,(user) => {
            if(user){
                setlogin(true)
            }
            setCheckingStatus(false)
            })
        }

        return () => {
            isMounted.current = false 
        }
    },[isMounted])
  return {login,checkingStatus}
}


