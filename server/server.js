const express = require("express")
const app = express()
const authRouter = require("./router/auth-router")
const relationRouter = require("./router/relation-router")
const connectDB = require("./utils/db")
const errorMiddleware = require("./middleware/error-middleware")
const PORT = process.env.PORT || 5000
const cors = require("cors")
require('dotenv').config();

const corsOptions = {
    origin: "http://localhost:5173",
    method: "GET, POST, PUT, PATCH, DELETE, HEAD",
    credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/relation", relationRouter)
app.use(errorMiddleware)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Running on PORT ${PORT}`)
    })
})