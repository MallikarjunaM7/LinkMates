import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth"
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const ForgotPassword = () => {
    
    const {token} = useAuth();
    const [data, setData] = useState({email: "", otp: ""})
    const [optsent, setOtpsent] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [passdata, setPassdata] = useState({password: "", confirmPassword: ""})

    const navigate = useNavigate()

    const handleChange = (e) => {
        console.log("HII")
        const {name, value} = e.target;
        console.log(name, value)
        setData({...data, [name]: value})
    }

    const backapi = "http://localhost:5000"

    const handleChangePassword = (e) => {
        const {name, value} = e.target

        setPassdata({...passdata, [name]: value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            setIsSending(true)
            const response = await fetch(`${backapi}/api/auth/forgotpassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const message = await response.json()
            if(message.notregmsg){
                toast.error(message.notregmsg)
                setIsSending(false)
            }
            if(response.ok){
                document.getElementById("emailbut").disabled = "true"
                toast.success(message.sucmsg)
                setOtpsent(true)
                setIsSending(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleOTPSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${backapi}/api/auth/verifyotpforgot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const message = await response.json()
            console.log(message)
            if(message.correctotpmsg){
                toast.success(message.correctotpmsg)
                setChangePassword(true)
                document.getElementById("inputotpbut").disabled = "true"
            }else if(message.inmsg){
                toast.error(message.inmsg)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePasswordSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${backapi}/api/auth/changeforgotpassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({...passdata, email: data.email})
            })

            const message = await response.json()

            if(message.nomatchmsg){
                toast.error(message.nomatchmsg)
                setPassdata({password: "", confirmPassword: ""})
            }else if(message.oldpassmsg){
                toast.error(message.oldpassmsg)
                setPassdata({password: "", confirmPassword: ""})
            }else if(message.sucmsg){
                toast.success(message.sucmsg)
                navigate("/login")
            }else if(message.extraDetails){
                toast.error(message.extraDetails)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if(token){
        return <Navigate to="/"/>
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input placeholder="Email" id="email" type="email" value={data.email} name="email" onChange={handleChange} autoComplete="off"/>
                <button id="emailbut" type="submit">Send OTP</button>
            </form>
            {
                optsent ? 
                <>
                    <form onSubmit={handleOTPSubmit}>
                        <input placeholder="OTP" id="otpinput" type="number" name = "otp" value={data.otp} onChange={handleChange}/>
                        <button id="inputotpbut" type="submit">Verify OTP</button>
                    </form>
                </>
                :
                <></>
            }
            {
                isSending ? <><h2>Processing</h2></> : <></>
            }

            {
                changePassword ? 
                <>
                    <form onSubmit={handlePasswordSubmit}>
                        <label htmlFor="password">New Password</label>
                        <input type="password" name="password" onChange={handleChangePassword} value={passdata.password}/>
                        <br />
                        <label htmlFor="password">Confirm Password</label>
                        <input type="password" name="confirmPassword" onChange={handleChangePassword} value={passdata.confirmPassword}/>
                        <button type="submit">Confirm</button>
                    </form>
                </>:
                <></>
            }
        </>
    )
}