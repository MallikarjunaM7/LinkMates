import "./Navbar.css"
import {NavLink} from "react-router-dom"
import { useAuth } from "../../store/auth"
import "../index.css"
import { useEffect, useState } from "react"

export const Navbar = () => {

    const {token, data, getMyDetails} = useAuth();
    const [number, setNumber] = useState(0)
    const [isLoad, setIsLoad] = useState(false)

    const backapi = "http://localhost:5000"

    const getNumber = async() => {
        setIsLoad(true)
        try {
            const response = await fetch(`${backapi}/api/relation/getnumber`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({username: data.username})
            })  
            
            const message = await response.json()
            console.log(message.nummsg)
            if(message.nummsg){
                setNumber(message.nummsg)
            }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoad(false)
        }
    }

    useEffect(() => {
        if(data.username){
            getNumber()
        }
    }, [data.username])

    return(
        <>
            <div className="container">
                <div className="main">
                    <h1 className="malli"><NavLink to="/">LinkMates</NavLink></h1>
                </div>
                <nav>
                    <ul>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        {
                            token? 
                            <>
                                <li><NavLink to ="/search">Search</NavLink></li>
                                <li><NavLink to="requests">Request{!isLoad ? <>({number})</>: <>....</>}</NavLink></li>
                                <li><NavLink to="/feedback">Feedback</NavLink></li>
                                <li><NavLink to="/services">Contacts</NavLink></li>
                                <li><NavLink to="/contact">Add Contact</NavLink></li>
                                <li><NavLink to="/logout">Logout</NavLink></li>
                            </>:
                            <>
                                <li><NavLink to="/ourfeedbacks">Feedbacks</NavLink></li>
                                <li><NavLink to="/login">Login</NavLink></li>
                                <li><NavLink to="/register">Register</NavLink></li>
                            </>
                        }
                    </ul>
                </nav>
            </div>
        </>
    )
}