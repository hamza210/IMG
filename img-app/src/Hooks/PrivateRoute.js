import React from 'react'
import {useAuth} from './auth'
import { Navigate, Outlet } from 'react-router'
import Spinner from 'react-bootstrap/Spinner';

const PrivateRoute = () => {
    const {login,checkingStatus} = useAuth()
    
    if(checkingStatus){
      return <Spinner />
    }

  return (
    <div>
      {
        login ?
        <Outlet /> :
        <Navigate to='/login' />
      }
    </div>
  )
}

export default PrivateRoute
