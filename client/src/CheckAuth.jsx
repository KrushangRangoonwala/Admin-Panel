import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const CheckAuth = ({children}) => {
    const navigate = useNavigate();
    const token = Cookies.get('userToken');

    useEffect(() => {
        if (!token || token.length === 0) {
            navigate('/login');
        }
    }, [])

    return (
        <>
            {token && token.length > 0 ? children : null}
        </>
    )
}

export default CheckAuth