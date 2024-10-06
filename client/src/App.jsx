import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Navbar} from "./components/Navbar"
import {Home} from "./pages1/Home"
import {About} from "./pages1/About"
import {Services} from "./pages1/Services"
import {Contact} from "./pages1/Contact"
import {Login} from "./pages1/Login"
import {Register} from "./pages1/Register"
import {Logout} from "./pages1/Logout"
import {Error} from "./pages1/Error"
import { Edituser } from './pages1/Edituser'
import { Edit } from './pages1/Edit'
import { ChangePassword } from './pages1/Password'
import {Feedback} from './pages1/Feedback'
import {OurFeedbacks} from './pages1/Ourfeedbacks'
import {Search} from './pages2/Search'
import {Requests} from './pages2/Requests'
import {View} from './pages2/View'
import {Following} from './pages2/Following'
import {Followers} from './pages2/Followers.jsx'
import {ForgotPassword} from './pages1/ForgotPassword'

const App = () => {
    return(
        <>
            <BrowserRouter>
            <Navbar/>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/about' element={<About/>}/>
                    <Route path='/services' element={<Services/>}/>
                    <Route path='/contact' element={<Contact/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/logout' element={<Logout/>}/>
                    <Route path='/edit/:id' element={<Edit/>}/>
                    <Route path='/services/edit/:id' element = {<Edituser/>}/>
                    <Route path='/changepassword' element= {<ChangePassword/>}/>
                    <Route path='/feedback' element = {<Feedback/>}/>
                    <Route path='/ourfeedbacks' element = {<OurFeedbacks/>}/>
                    <Route path='/search' element = {<Search/>}/>
                    <Route path='/requests' element = {<Requests/>}/>
                    <Route path='view/:oppUsername' element = {<View/>}/>
                    <Route path='/following' element={<Following/>}/>
                    <Route path='/followers' element={<Followers/>}/>
                    <Route path='/forgotpassword' element={<ForgotPassword/>}/>
                    <Route path='/*' element={<Error/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
