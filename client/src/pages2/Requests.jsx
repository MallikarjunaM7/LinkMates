import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth"
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const Requests = () => {

    const {token, data, getMyDetails} = useAuth();
    const [requests, setRequests] = useState([])
    const [followBackStatus, setFollowBackStatus] = useState([])
    const [frontiAmFollower, setFrontiAmFollower] = useState([])
    const [frontRequested, setFrontRequested] = useState([])
    const [frontRequest, setFrontRequest] = useState([])
    const backapi = "http://localhost:5000"

    const navigate = useNavigate()

    const getRequestsInfo = async() => {
        try {
            const response = await fetch(`${backapi}/api/relation/getrequests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({username: data.username})
            })

            const message = await response.json()
            if(message.sucmsg){
                setRequests(message.sucmsg)
            }
            console.log(message)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(data.username){
            getRequestsInfo()
        }
    }, [data.username])

    const handleAccept = async(byUsername) => {
        try {
            const response = await fetch(`${backapi}/api/relation/acceptrequest`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({byUsername: byUsername, myUsername: data.username})
            })
            const message = await response.json()
            console.log(message)
            if(message.sucmsg){
                toast.success(message.sucmsg)
                setFollowBackStatus([...followBackStatus, byUsername])
                if(message.iAmFollower){
                    setFrontiAmFollower([...frontiAmFollower, byUsername])
                }else if(message.requested){
                    setFrontRequested([...frontRequested, byUsername])
                }else{
                    setFrontRequest([...frontRequest, byUsername])
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFollowBack = async(toUser) => {
        try {
            const response = await fetch(`${backapi}/api/relation/addrequest`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({fromUser: data.username, toUser: toUser})
            })
            const message = await response.json();
            if(message.sucmsg){
                toast.success(message.sucmsg)
                const newRequests = requests.filter(item => item != toUser)
                setRequests(newRequests)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const unsendFunction = async(toUser) => {
        try {
            const response = await fetch(`${backapi}/api/relation/deleterequest`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({fromUser: data.username, toUser: toUser})
            })

            const message = await response.json()
            console.log(message)
            if(message.sucmsg){
                toast.success(message.sucmsg)
                const newRequests = requests.filter(item => item != toUser)
                setRequests(newRequests)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleView = (oppUsername) => {
        navigate(`/view/${oppUsername}`)
    }

    const handleReject = async(toRejectUsername) => {
        try {
            const response = await fetch(`${backapi}/api/relation/rejectrequest`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({myUsername: data.username, toRejectUsername: toRejectUsername})
            })

            const message = await response.json()
            if(message.sucmsg){
                console.log(message)
                toast.success(message.sucmsg)
                const newRequestsReject = requests.filter(item => item != toRejectUsername)
                setRequests(newRequestsReject)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if(!token){
        return <Navigate to="/"/>
    }

    return(
        <>
            {requests.length != 0 ? 
            
                <>
                <section className="">
                    <div className="container">
                        <h1 className="users">Requests</h1>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Accept</th>
                                    <th>Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((currElement, index) => {
                                    return(
                                        <tr key={index}>
                                            <th>{currElement}</th>
                                            <th>{followBackStatus && followBackStatus.includes(currElement)? 
                                                
                                                (frontiAmFollower && frontiAmFollower.includes(currElement) ? <button onClick={() => {handleView(currElement)}}>View</button> : (frontRequested && frontRequested.includes(currElement) ? <button  onClick={() => unsendFunction(currElement)} >Requested</button> : <button onClick={() => handleFollowBack(currElement)}>Follow Back</button>))
                                                :
                                                <>
                                                    <button onClick={() => handleAccept(currElement)}>Accept</button>
                                                </>
                                                }    
                                            </th>
                                            {followBackStatus && followBackStatus.includes(currElement)? <></>: <th><button onClick={() => handleReject(currElement)}>Reject</button></th>}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
                </>:

                <>
                    <h2 className="noreq">No Requests As of Now</h2>
                </>
        }
        </>
    )
}