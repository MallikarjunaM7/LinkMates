import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth"
import {useNavigate, NavLink} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import '../../public/images/pixlr-image-generator-8cadf975-cb5f-414f-b952-d79bfcb89c4c.png'
import { FaUserEdit } from "react-icons/fa";

export const Home = () => {

    const  {token, data, isLoading, getMyDetails} = useAuth();
    const navigate = useNavigate()
    

    const handleSubmit = async(id) => {
        if(id){navigate(`/edit/${id}`)}
    }

    const handlePassword = () => {
        navigate("/changepassword")
    }
    useEffect(() => {
        getMyDetails()
    }, [])

    console.log(data)

    if(isLoading){
        return <><h1 className = "users">Loading....</h1></>
    }


    if(!token ){
        return(
        <>
            <div className="imagediv">
            <div className="left">
                <h1 className="welcome">Welcome</h1>
                <h2>This Website isn't responsive ....Just Under Construction But....</h2>
                <h2>Functions very well....Do check out all features</h2>

                <h2>Its Mainly a Multi user website please create alteast two accounts to Socialize with each other</h2>
            </div>
            <img className="image" height="400" width="500" src="/images/pixlr-image-generator-8cadf975-cb5f-414f-b952-d79bfcb89c4c.png" alt="" />
            </div>
        </>)
    }
    
    return(
        <>
            <div className="mainHome">
                <div className="homediv">
                    <h1>Welcome {data.username}</h1>
                    <h2>Your Email : {data.email}</h2>
                    <h2>Your Contact number : {data.phone}</h2>
                    <h2>Number of Contacts : {data.number}</h2>
                    <h2><NavLink to ="/following">Following: {data.Following ? data.Following.length: 0}</NavLink></h2>
                    <h2><NavLink to ="/followers">Followers: {data.Followers ? data.Followers.length: 0}</NavLink></h2>
                    <br />
                    <button onClick={() => handleSubmit(data._id)}><FaUserEdit className="edithome"/></button>
                    <br />
                    <button onClick={() => handlePassword()}>Change Password</button>
                </div>
                <div>
                    <img className="image" height="400" width="500" src="/images/pixlr-image-generator-8cadf975-cb5f-414f-b952-d79bfcb89c4c.png" alt="" />
                </div>
            </div>
        </>
    )
}
