import { useEffect, useState } from "react"
import { useAuth } from "../../store/auth"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom";

export const Contact = () => {

    const {token} = useAuth()
    const navigate = useNavigate()

    if(!token){

        console.log("not loginned")
        return <Navigate to="/"/>
    }

    const [data, setData] = useState({
        username: "",
        phone: "",
        place: "", 
        favorite: "no",
    })

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        console.log(name, value)
        setData({
            ...data,
            [name]: value
        })

    }

    useEffect(() => {
        console.log(data)
    }, [data])

    const backapi = "https://linkmates-backend.onrender.com"

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log("dat", data)
        try {
            const response = await fetch(`${backapi}/api/auth/addcontact`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
            
            const message = await response.json()
            console.log("message ",message)
            if(message.msg){
                toast.error(message.msg)
            }
            if(message.extraDetails){
                toast.error(message.extraDetails)
            }
            if(response.ok){
                toast.success("Contact Details added Successfully")
                setData({
                    username: "",
                    phone: "",
                    place: "",
                    favorite: "no"
                })
                navigate("/services")
            }
        } catch (error) {
            console.log("error",error)
        }
    }
    return(
        <>
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" type="text" name = "username" value={data.username} onChange={handleChange} autoComplete="off"/>
                <br />
                <input placeholder="Contact Number" type="number" name="phone" value={data.phone} onChange={handleChange} autoComplete="off"/>
                <br />
                <input placeholder="Place" type="text" name="place" value={data.place} onChange={handleChange} autoComplete="off"/>
                <br />
                <select name="favorite" id="field" value={data.favorite} onChange={handleChange}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                <button type="submit">Add Contact</button>
            </form>
        </>
    )
}
