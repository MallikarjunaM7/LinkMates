import { useEffect, useState } from "react"
import { useParams, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../../store/auth"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const View = () => {

    const {oppUsername} = useParams()
    const {token, data} = useAuth()
    const navigate = useNavigate()
    const [oppDetails, setOppDetails] = useState({
        username: "",
        email: "",
        phone: "",
        Following: "",
        Followers: ""
    })
    const backapi = "https://linkmates-backend.onrender.com"

    console.log("Hiiii")
    useEffect(() => {
        if(data.username){
            console.log(data.username, oppUsername)
            const getOppUsernameInfo = async() => {
                if(data.username === oppUsername){
                    return navigate("/")
                }
                try {
                    const response = await fetch(`${backapi}/api/relation/getoppusernameinfo`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({myUsername: data.username, oppUsername: oppUsername})
                    })
                    const message = await response.json()
                    if(message.extraDetails){
                        toast.error(message.extraDetails)
                        navigate("/search")
                    }else{
                        console.log(message)
                        setOppDetails(message)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            getOppUsernameInfo()
        }
    }, [data.username])
    
    if(!token){
        return <Navigate to="/login"/>
    }
    return(
        <>
            {
                oppDetails.username ? 

                <>
                    <div className="homedivV">
                        <h1>Username:  {oppDetails.username}</h1>
                        <h2>Email : {oppDetails.email}</h2>
                        <h2>Contact number : {oppDetails.phone}</h2>
                        <h2>Following: {oppDetails.Following? oppDetails.Following.length : 0}</h2>
                        <h2>Followers: {oppDetails.Followers ? oppDetails.Followers.length: 0}</h2>
                        <br />
                    </div>
                </>:
                <>
                    <h1>Loading.....</h1>
                </>
            }
        </>
    )
}
