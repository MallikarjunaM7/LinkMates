import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../store/auth"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Edituser = () => {

    const {id} = useParams()
    const {token} = useAuth()
    const navigate = useNavigate()
    const backapi = "https://linkmates-backend.onrender.com"

    const [data, setData] = useState({
        username: "",
        phone: "",
        place: "",
        favorite: "",
        id: "",
        oldName: "",
        oldPhone: "",
        oldPlace: "",
        oldFavorite: ""
    })


    const getInfo = async() => {
        try {
            const response = await fetch(`${backapi}/api/auth/getuserbyid/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("response", response)
            const allData = await response.json()
            console.log("all",allData)
            if(response.ok){
                console.log("Hiiiiiiii")
                setData({...data, ...allData})
                if(allData.username){
                    data.oldName = allData.username
                    data.oldPhone = allData.phone
                    data.oldPlace = allData.place
                    data.oldFavorite = allData.favorite
                }
                console.log("data", data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setData({
            ...data,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        data.id = id
        console.log("data", data)
        try {
            const response = await fetch(`${backapi}/api/auth/updateuser`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
            const message = await response.json()
            console.log(message)
            if(message.samemsg){
                toast.error(message.samemsg)
            }
            else if(message.errmsg){
                toast.error(message.errmsg)
            } else if(message.sucmsg){
                toast.success(message.sucmsg)
                navigate("/services")
            }else if(message.extraDetails){
                toast.error(message.extraDetails)
            }else if(message.halfmsg){
                toast.success(message.halfmsg)
                navigate("/services")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getInfo()
    }, [])



    return (<>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username" onSubmit={handleSubmit}>Username</label>
            <input type="text" name = "username" value={data.username} onChange={handleChange} autoComplete="off"/>

            <label htmlFor="phone">Phone</label>
            <input type="number" name="phone" value={data.phone} onChange={handleChange} autoComplete="off"/>

            <label htmlFor="place">Place</label>
            <input type="text" name="place" value={data.place} onChange={handleChange} autoComplete="off"/>

            <label htmlFor="favorite">Favorite</label>
            <select name="favorite" id="field" value={data.favorite} onChange={handleChange}>
                {data.oldFavorite === "no" ? 
                    <>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </>:
                        <>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </>
                }
            </select>            
        
            <button type="submit">Update</button>
        </form>
    </>)
}
