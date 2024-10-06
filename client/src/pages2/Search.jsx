import { useEffect, useState } from "react"
import { useAuth } from "../../store/auth"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export const Search = () => {

    const [dataform, setDataform] = useState({username: "", hisUsername: ""})
    const [user, setUser] = useState([])
    const [table, setTable] = useState(false)
    const {token, data} = useAuth()
    const [requestdata, setRequestdata] = useState({fromUser: "", toUser: ""})
    const [sendData, setSendData] = useState(false)
    const [alreadysent, setAlreadysent] = useState(false)
    const [unsend, setUnsend] = useState(false)
    const [acceptedRequest, setAcceptedRequest] = useState(false)
    const navigate = useNavigate()
    const backapi = "https://linkmates-backend.onrender.com"

    useEffect(() => {
        if(data){
            dataform.hisUsername = data.username
            setRequestdata({...requestdata, fromUser: data.username})
        }
    }, [data])

    const handleChange = (e) => {
        const {name, value} = e.target
        setDataform({...dataform, [name]: value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setAcceptedRequest(false)
        setAlreadysent(false)
        try {
            const response = await fetch(`${backapi}/api/relation/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dataform)
            })
            const message = await response.json()
            
            if(message.acceptedmsg){
                console.log("main", message)
                setUser([message.user])
                setAcceptedRequest(true)
                setTable(true)
            }
            else if(message.samemsg){
                toast.error(message.samemsg)
                setTable(false)
            }
            else if(message.nomsg){
                toast.error(message.nomsg)
                setDataform({...dataform, username: ""})
                setTable(false)
            }
            else if(response.ok){
                console.log("userBaby", message)
                setUser([message.user])
                console.log("as",message.alreadySent)
                setAlreadysent(message.alreadySent)
                setTable(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(sendData){
            const sendRequest = async() => {
                try {
                    const response = await fetch(`${backapi}/api/relation/addrequest`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(requestdata)
                    })
        
                    const message = await response.json();
                    if(message.sucmsg){
                        toast.success(message.sucmsg)
                        setAlreadysent(true)
                        setSendData(false)
                    }
                } catch (error) {
                    console.log(error)
                }
            }

            sendRequest()
        }
    }, [sendData])

    const handleRequest = async(username) =>{
        setRequestdata({...requestdata, toUser: username})
        setSendData(true)
    }

    const handleUnRequest = async(username) => {
        setRequestdata({...requestdata, toUser: username})
        setUnsend(true)
    }

    useEffect(() => {
        console.log(requestdata)
        if(unsend){
            const unsendFunction = async() => {
                try {
                    const response = await fetch(`${backapi}/api/relation/deleterequest`,{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(requestdata)
                    })
        
                    const message = await response.json()
                    console.log(message)
                    if(message.sucmsg){
                        setAlreadysent(false)
                        toast.success(message.sucmsg)
                        setUnsend(false)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            unsendFunction()
        }
    }, [unsend])

    const handleView = (oppUsername) => {
        navigate(`/view/${oppUsername}`)
    }

    if(!token){
        return <Navigate to="/"/>
    }

    return(
        <>
            <div className="RegForm">
            <form className="searchform" onSubmit={handleSubmit}>
                <label htmlFor="Find"><h1>Search</h1></label>
                <input autoComplete="off" name="username" type="text" placeholder="Search by Username" value={dataform.username} onChange={handleChange}/>
                <button type="submit"><FiSearch className="find"/></button>
            </form>
            </div>
            {
                table ? 
                <>
                <section className="">
                    <div className="container">
                        <h1 className="users">Users</h1>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Request</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.map((currElement, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{currElement}</td>
                                            <td>{acceptedRequest ?
                                             <button onClick={() => handleView(currElement)}>View</button> :
                                              alreadysent ? 
                                              <><button onClick={() => handleUnRequest(currElement)}>Requested</button></> 
                                              : <button onClick={() => handleRequest(currElement)}>Request</button>}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
                </>
                :
                <>
                
                </>
            }
        </>
    )
}
