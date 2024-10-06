import {useEffect, useState} from "react"
import { useAuth } from "../../store/auth"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../index.css"
import { Navigate, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

export const Services = () => {

    const {token} = useAuth()
    const [contacts, setContacts] = useState([])
    const[loginId, setLoginId] = useState("")
    const [nocontacts, setNocontacts] = useState(false)
    const backapi = "https://linkmates-backend.onrender.com""
    const [data, setData] = useState({
        detail: "",
        field: "username",
        id: ""
    })
    
    const navigate = useNavigate()
    if(!token){

        console.log("not loginned")
        return <Navigate to="/"/>
    }

    const handleChange = async(e) => {

        const name = e.target.name;
        const value = e.target.value;

        setData({
            ...data,
            [name]: value
        })
    
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        data.id = loginId
        console.log(data)
        if(data.field === "favorite"){
            try {
                const response = await fetch(`${backapi}/api/auth/getfavorites`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
    
                if(response.ok){
                    const favorites = await response.json()
                    setContacts(favorites)
                }
            } catch (error) {
                console.log(error)
            }
        }
        else{
            try {
                const response = await fetch(`${backapi}/api/auth/findcontacts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                })
                console.log(response)
                if(response.ok){
                    const foundContacts = await response.json()
                    console.log("founded",foundContacts)
                    if(foundContacts.nomsg){
                        setNocontacts(true)
                        setContacts([])
                    }else{
                        setNocontacts(false)
                        console.log(foundContacts)
                        setContacts(foundContacts)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const getContacts = async() => {
        try {
            const response = await fetch(`${backapi}/api/auth/getcontacts`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            if(response.ok){
                const allContacts = await response.json()
                console.log("all con",allContacts)
                setContacts(allContacts.allContacts)
                setLoginId(allContacts.loginId)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getContacts()
    }, [])

    const deleteUserById = async(id) => {
        try {
            const response = await fetch(`${backapi}/api/auth/delete/${id}`,{
                method: "DELETE",
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.ok){
                toast.success("Contact Deleted Successfully")
                getContacts()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const editUserById = (id) => {
        navigate(`/services/edit/${id}`)
    }

    const returnFunction = () => {
        getContacts()
        setData({...data, detail: "", field: "username"})
        setNocontacts(false)
    }

    return(
        <>
            <div>
                {
                    nocontacts? <><h2 className="users">No Contacts Found</h2></> : <></>
                }
                <form onSubmit={handleSubmit}>
                    <input placeholder="Find" id="detail" type="text" name="detail" value={data.detail} onChange={handleChange} autoComplete="off"/>

                    <select name="field" id="field" value={data.field} onChange={handleChange}>
                        <option value="username">Username</option>
                        <option value="phone">Phone</option>
                        <option value="place">Place</option>
                        <option value="favorite">Favorite</option>
                    </select>

                    <button type="submit" className="but"><FiSearch className="find"/></button>
                    <button onClick={returnFunction} className="but" type="button">Return</button>

                </form>
                <section className="">
                    <div className="container">
                        <h1 className="users">Contacts</h1>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Place</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((currElement, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{currElement.username}</td>
                                            <td>{currElement.phone}</td>
                                            <td>{currElement.place}</td>
                                            <td><FaEdit className="import" onClick={() => editUserById(currElement._id)}/>
                                            </td>
                                            <td><MdDelete className="import" onClick={() => deleteUserById(currElement._id)}/></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}
