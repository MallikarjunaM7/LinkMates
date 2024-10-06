import { Navigate } from "react-router-dom"
import { useAuth } from "../../store/auth"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const Followers = () => {

    const {data, token} = useAuth()
    const [followers, setFollowers] = useState([])
    const backapi = "const backapi = "https://linkmates-backend.onrender.com""

    useEffect(() => {
        if(data.username){
            setFollowers(data.Followers)
        }
    }, [data.username])

    const handleRemove = async(userToRemove) => {
        if(data.username){
            try {
                const response = await fetch(`${backapi}/api/relation/removefollower`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({myUsername: data.username, userToRemove: userToRemove})
                })

                const message = await response.json()
                if(message.sucmsg){
                    toast.success(message.sucmsg)
                    const newRequests = followers.filter(item => item != userToRemove)
                    setFollowers(newRequests)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    if(!token){
        return <Navigate to="/"/>
    }

    return(
        <>
            {followers.length === 0? 
            
                <>
                    <h2>You are followed by None</h2>
                </>
                :
                <>
            <section className="">
                <div className="container">
                    <h1>Followers</h1>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Unfollow</th>
                            </tr>
                        </thead>
                        <tbody>
                            {followers.map((currElement, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{currElement}</td>
                                        <td><button onClick={() => {handleRemove(currElement)}}>Remove</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
        }
        </>
    )
}
