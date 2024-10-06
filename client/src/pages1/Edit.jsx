import { useState, useEffect } from "react"
import { useAuth } from "../../store/auth"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const Edit = () => {

    const {data, token} = useAuth()
    const {id} = useParams()
    console.log("iddddd", id)
    const navigate = useNavigate()
    const backapi = "http://localhost:5000"

    const [details, setDetails] = useState(
        {   username: "",
            email:"",
            phone: "" ,
            oldUsername: "",
            oldEmail: "",
            oldPhone: "",
            id: "",
        }
    )
    
    useEffect(() => {
        if (data.username) {
            setDetails({
                username: data.username ,
                email: data.email ,
                phone: data.phone ,
                oldUsername: data.username,
                oldEmail: data.email,
                oldPhone: data.phone,
                id: id,
            });
        }
    }, [data]);

    const handleChange = (e) => {

        const name = e.target.name;
        const value = e.target.value;

        setDetails({...details, [name]: value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(details)
        try {
            const response = await fetch(`${backapi}/api/auth/updatemainuser`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify(details)
            })  
            console.log(response)
            const message = await response.json()
            console.log(message)

            if(message.extraDetails){
                toast.error(message.extraDetails)
            }
            
            else if(message.samemsg){
                toast.error(message.samemsg)
            }

            else if(message.halfmsg){
                toast.success("Updated Successsfully")
            }

            else if(message.ispresmsg){
                toast.error(message.ispresmsg)
            }
            if(response.ok){
                console.log("Hii")
                navigate("/")
            }
        } catch (error) {
            
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={details.username} onChange={handleChange} autoComplete="off"/>
                <br />
                <label htmlFor="email">Email</label>
                <input type="text" name = "email" value={details.email} onChange={handleChange}  autoComplete="off"/>
                <br />
                <label htmlFor="phone">Phone</label>
                <input type="number" name="phone" value={details.phone} onChange={handleChange}  autoComplete="off"/>
                <br />
                <button type="submit">Update</button>
            </form>
        </>
    )
}