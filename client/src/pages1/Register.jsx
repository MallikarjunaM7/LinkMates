import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import {NavLink, useNavigate} from "react-router-dom"
import { useAuth } from "../../store/auth";
import { Navigate } from "react-router-dom";


export const Register = () => {

    const navigate = useNavigate();

    const {token} = useAuth()

    const [data, setData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    })

    const [otpdata, setOtpdata] = useState({
        email: "",
        otp: ""
    })

    const[sendingOTP, setSendingOTP] = useState(false)
    const [formDisabled, setFormDisabled] = useState(false)
    const [formDisablede, setFormDisablede] = useState(false)

    const [otpinput, setOtpinput] = useState(false)

    const deleteOTP = async() => {
        const response = await fetch("${backapi}eleteotp", {
            method: "DELETE",
            body: {"email": otpdata.email}
        })
    }

    const handleChange = async(e) => {
        const name = e.target.name;
        const value = e.target.value;
        console.log(data)
        setData({
            ...data,
            [name]: value
        })
    }

    const backapi = "http://localhost:5000"

    const handleChangeotp = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setOtpdata({
            ...otpdata,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log("final", data)
        setSendingOTP(true)
        console.log("data body", data)
        otpdata.email = data.email
        try {
            const response = await fetch(`${backapi}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            console.log(response)
            const message = await response.json()
            if(message.extraDetails){
                toast.error(message.extraDetails)
            }
            else if(message.alreadymsg){
                toast.error(message.alreadymsg)
                setSendingOTP(false)
            }
            if(response.ok){
                setFormDisabled(true)
                setFormDisablede(true)
                toast.success("OTP Sent Successfully")
                setSendingOTP(false)
                setOtpinput(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmitOtp = async(e) => {
        e.preventDefault()
        try {
            const response  = await fetch(`${backapi}/api/auth/verifyotp/${otpdata.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(otpdata)
            })
            console.log(response)
            const message = await response.json()
            if(response.ok && message.sucmsg){
                toast.success("OTP Verifired: Registered Successfully")
                navigate("/login")
            }else if(message.inmsg){
                toast.error(message.inmsg)
                console.log(data)
                setOtpdata({...otpdata, otp: ""})
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeEmail = () => {
        console.log(data)
        setFormDisablede(false)
    }

    if(token){
        return <Navigate to="/"/>
    }

    return(
        <>
            <div className="RegForm">
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" disabled={formDisabled} className="submit" id="submit1" type="text" name="username" value={data.username} onChange={handleChange} autoComplete="off"/>
                <br />
                <input placeholder="Email" disabled={formDisablede} className="submit" id="submit2" type="text" name = "email" value={data.email} onChange={handleChange} autoComplete="off"/>
                <br />
                
                <input placeholder="Contact Number" disabled={formDisabled} className="submit" id="submit3" type="number" name="phone" value={data.phone} onChange={handleChange} autoComplete="off"/>
                <br />

                <input placeholder="Password" disabled={formDisabled} className="submit" id="submit4" type="password" name="password" value={data.password} onChange={handleChange} autoComplete="off"/>
                <br />
                <button disabled={formDisablede} className="submit" id="submit5" type="submit">Register</button>
            </form>
            <h3><NavLink className="regforgot" to="/login">Already have an Account ?</NavLink></h3>
            {
                    otpinput? 
                    <>
                        <form onSubmit={handleSubmitOtp}>
                            <input placeholder="Enter OTP" type="number" name="otp" id="otp" autoComplete="off" value={otpdata.otp} onChange={handleChangeotp}/>
                            <button type="button" onClick={handleChangeEmail}>Change Email</button>
                            <br />
                            <button type="submit">Submit</button>
                        </form>
                    </>:
                    <>
                        
                    </>
            }
            {
                sendingOTP ? <><h2>Processing.....</h2></>: <></>
            }
            </div>
        </>
    )
}