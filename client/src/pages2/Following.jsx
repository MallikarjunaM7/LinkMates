import { useParams, Navigate } from "react-router-dom"
import { useAuth } from "../../store/auth"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const Following = () => {
    const {myUsername} = useParams()

    const {data, token} = useAuth()
    const [following, setFollowing] = useState([])
    const backapi = "https://linkmates-backend.onrender.com"

    useEffect(() => {
        if(data.username){
            setFollowing(data.Following)
        }
    }, [data.username])

    const handleUnfollow = async(userToUnfollow) => {
        if(data.username){
            try {
                const response = await fetch(`${backapi}/api/relation/unfollow`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({myUsername: data.username, userToUnfollow: userToUnfollow})
                })

                const message = await response.json()
                if(message.sucmsg){
                    toast.success(message.sucmsg)
                    const newRequests = following.filter(item => item != userToUnfollow)
                    setFollowing(newRequests)
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
            {following.length === 0? 
            
                <>
                    <h2>Your aren't Following Anyone</h2>
                </>
                :
                <>
            <section className="">
                <div className="container">
                    <h1>Following</h1>
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
                            {following.map((currElement, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{currElement}</td>
                                        <td><button onClick={() => {handleUnfollow(currElement)}}>Unfollow</button></td>
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
