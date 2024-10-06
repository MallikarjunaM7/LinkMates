import { useEffect, useState } from "react"
import { useAuth } from "../../store/auth"
import { Navigate } from "react-router-dom"

export const OurFeedbacks = () => {

    const {token} = useAuth()

    const [feedbacksstate, setFeedbacksstate] = useState([])
    const [averagerating, setAveragerating] = useState(0)
    const backapi = "https://linkmates-backend.onrender.com"

    const getOurfeedbacks = async() => {
        try {
            const response = await fetch(`${backapi}/api/auth/getfeedbacks`, {
                method: "GET"
            })
            const feedbacks = await response.json()
            if(response.ok){
                console.log(feedbacks)
                let avgRating = 0
                feedbacks.forEach(element => {
                    avgRating = avgRating+element.rating
                });
                avgRating = avgRating / feedbacks.length
                setFeedbacksstate(feedbacks)
                setAveragerating(avgRating)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getOurfeedbacks()
    }, [])

    if(token){
        return <Navigate to="/feedback"/>
    }
    if(feedbacksstate.length === 0){
        return(<><h1 className = "users">No Feebdacks As of Now</h1></>)
    }
    return(
        <>
            <h1 className="fb">Our Feedbacks</h1>
            <section className="">
                <div className="container">
                    <h1 className="fb">Our Average Rating : {averagerating.toFixed(2)}</h1>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Feedback</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacksstate.map((currElement, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{currElement.username}</td>
                                        <td>{currElement.email}</td>
                                        <td>{currElement.feedback}</td>
                                        <td>{currElement.rating}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}
