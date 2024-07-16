import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const Auth = ( { children } ) => {
    const isUserActive = useSelector(state => state.auth.activeLogin);
    if(isUserActive) {
        return (
            <>{ children }</> 
            )
    }else {
        return (
             <Navigate replace to="/" /> 
            )
    }

}

export default Auth