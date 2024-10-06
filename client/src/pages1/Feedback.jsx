import { useEffect, useState } from "react"
import { useAuth } from "../../store/auth"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from "react-router-dom";


export const Feedback = () => {

    const {data, token} = useAuth()
    const [dataform, setDataform] = useState({
        username: "",
        email: "",
        feedback: "",
        rating: 5
    })
    const backapi = "http://localhost:5000"

    useEffect(() => {
        if(data.username){
           setDataform(
            {...dataform,  
            username: data.username,
            email: data.email}
        )
        }
    }, [data])

    const handleChange = (e) => {
        const {name, value} = e.target
        console.log(name, value)
        setDataform({...dataform, [name]: value})
    }

    const handleSubmit =async(e) => {
        e.preventDefault()
        console.log(dataform)
        try {
            const response = await fetch(`${backapi}/api/auth/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify(dataform)
            })
            const message = await response.json()
            if(message.errmsg){
                toast.error(message.errmsg)
            }else if(message.limitmsg){
                toast.error(message.limitmsg)
            }
            else if(response.ok){
                toast.success(message.sucmsg)
            }
            setDataform({
                username: data.username,
                email: data.email,
                feedback: "",
                rating: 5
            })
        } catch (error) {
            console.log(error)
        }
    }

    if(!token){
        return <Navigate to="/"/>
    }
    return(
        <>
            <div className="RegForm">
            <form className="feedbackform" onSubmit={handleSubmit}>
                <input disabled type="text" name="username" value={dataform.username} onChange={handleChange} autoComplete="off"/>
                <br />
                <input disabled type="text" name = "email" value={dataform.email} onChange={handleChange} autoComplete="off"/>
                <br />
                <textarea placeholder="Must contain more than 15 characters......." rows="8" cols="50" name="feedback" onChange={handleChange} value={dataform.feedback}></textarea>
                <br />
                <label htmlFor="ratings">Choose a Rating:</label>
                <select name="rating" onChange={handleChange} value={dataform.rating}>
                    <option value="5">5</option>
                    <option value="4.5">4.5</option>
                    <option value="4">4</option>
                    <option value="3.5">3.5</option>
                    <option value="3">3</option>
                    <option value="2.5">2.5</option>
                    <option value="2">2</option>
                    <option value="1.5">1.5</option>
                    <option value="1">1</option>
                    <option value="0.5">0.5</option>
                    <option value="0">0</option> 
                </select>
                <button type="submit">Submit</button>
            </form>
            </div>
        </>
    )
}