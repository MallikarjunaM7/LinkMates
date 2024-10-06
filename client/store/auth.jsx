import {createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const storeTokenInLS = (token) => {
        setToken(token)
        localStorage.setItem("token", token)
    }

    const backapi = "https://linkmates-backend.onrender.com"

    const LogoutUser = () => {
        setToken("")
        localStorage.removeItem("token")
    }
    const getMyDetails = async() => {
        if(token){
            setIsLoading(true)
            try {
                const response = await fetch(`${backapi}/api/auth/getmydetails`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const message = await response.json()
                    console.log("bef",message)
                    setData({...message.mydetails, number: message.number})
                    setIsLoading(false)
                    
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getMyDetails()
    }, [])

    return(
        <>
            <AuthContext.Provider value={{storeTokenInLS, token, LogoutUser, data, isLoading, getMyDetails, }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext)
    return authContextValue
}
