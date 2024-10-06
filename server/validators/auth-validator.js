const {z} = require("zod")

const registerSchema = z.object({
    username: z
    .string({required_error: "Name required"})
    .trim()
    .min(3, {message: "Name must be atleast three characters"})
    .max(255, {message: "Name must not be greater than 255 characters"}),

    email: z
    .string({required_error: "email required"})
    .trim()
    .min(3, {message: "Email must be atleast 3 characters"})
    .max(255, {message: "Email must not be greater than 255 characters"}),

    phone: z
    .string({required_error: "phone required"})
    .trim()
    .min(10, {message: "Number must contain atleast 10 digits"})
    .max(20 , {message: "Number can contain upto 20 digits"}),

    password: z
    .string({required_error: "Password required"})
    .trim()
    .min(7, {message: "Password must contain atleast 7 characters"})
    .max(1024 , {message: "password can max out at 1024 characters"}),
})

const loginSchema = z.object({
    email: z
    .string({required_error: "email required"})
    .trim()
    .min(3, {message: "Email must be atleast 3 characters"})
    .max(255, {message: "Email must not be greater than 255 characters"}),

    password: z
    .string({required_error: "Password required"})
    .trim()
    .min(7, {message: "Password must contain atleast 7 characters"})
    .max(1024 , {message: "password can max out at 1024 characters"}),
})

const addContactSchema = z.object({
    username: z
    .string({required_error: "name required"})
    .trim()
    .min(3, {message: "Name must be atleast 3 characters"})
    .max(255, {message: "Name must not be greater than 255 characters"}),

    phone: z
    .string({required_error: "phone required"})
    .trim()
    .min(10, {message: "Number must contain atleast 10 digits"})
    .max(20 , {message: "Number can contain upto 20 digits"}),

    place: z
    .string({required_error: "Place required"})
    .trim()
    .min(3, {message: "Place must be atleast 3 characters"})
    .max(255, {message: "Place must not be greater than 255 characters"}),

    favorite: z
    .string({required_error: "Favorite required"})
    .trim()
    .min(1, {message: "Favorite must be atleast 3 characters"})
    .max(255, {message: "Favorite must not be greater than 255 characters"}),


})

const updateSchema = z.object({
    username: z
    .string({required_error: "name required"})
    .trim()
    .min(3, {message: "Name must be atleast 3 characters"})
    .max(255, {message: "Name must not be greater than 255 characters"}),

    phone: z
    .string({required_error: "phone required"})
    .trim()
    .min(10, {message: "Number must contain atleast 10 digits"})
    .max(20 , {message: "Number can contain upto 20 digits"}),

    place: z
    .string({required_error: "Place required"})
    .trim()
    .min(3, {message: "Place must be atleast 3 characters"})
    .max(255, {message: "Place must not be greater than 255 characters"}),

    id: z
    .string({required_error: "Id required"})
    .trim()
    .min(3, {message: "Place must be atleast 3 characters"})
    .max(255, {message: "Place must not be greater than 255 characters"}),

    favorite: z
    .string({required_error: "Favorite required"})
    .trim()
    .min(1, {message: "Favorite must be atleast 3 characters"})
    .max(255, {message: "Favorite must not be greater than 255 characters"}),

    oldName: z
    .string({required_error: "name required"})
    .trim()
    .min(3, {message: "Name must be atleast 3 characters"})
    .max(255, {message: "Name must not be greater than 255 characters"}),

    oldPhone: z
    .string({required_error: "phone required"})
    .trim()
    .min(10, {message: "Number must contain atleast 10 digits"})
    .max(20 , {message: "Number can contain upto 20 digits"}),

    oldPlace: z
    .string({required_error: "Place required"})
    .trim()
    .min(3, {message: "Place must be atleast 3 characters"})
    .max(255, {message: "Place must not be greater than 255 characters"}),

    oldFavorite: z
    .string({required_error: "Favorite required"})
    .trim()
    .min(1, {message: "Favorite must be atleast 3 characters"})
    .max(255, {message: "Favorite must not be greater than 255 characters"}),

})

const updateMainSchema = z.object({
    username: z
    .string({required_error: "name required"})
    .trim()
    .min(3, {message: "Name must be atleast 3 characters"})
    .max(255, {message: "Name must not be greater than 255 characters"}),

    email: z
    .string({required_error: "email required"})
    .trim()
    .min(3, {message: "Email must be atleast 3 characters"})
    .max(255, {message: "Email must not be greater than 255 characters"}),

    phone: z
    .string({required_error: "phone required"})
    .trim()
    .min(10, {message: "Number must contain atleast 10 digits"})
    .max(20 , {message: "Number can contain upto 20 digits"}),

    oldUsername: z
    .string({required_error: "name required"})
    .trim()
    .min(3, {message: "Name must be atleast 3 characters"})
    .max(255, {message: "Name must not be greater than 255 characters"}),

    oldEmail: z
    .string({required_error: "email required"})
    .trim()
    .min(3, {message: "Email must be atleast 3 characters"})
    .max(255, {message: "Email must not be greater than 255 characters"}),

    oldPhone: z
    .string({required_error: "phone required"})
    .trim()
    .min(10, {message: "Number must contain atleast 10 digits"})
    .max(20 , {message: "Number can contain upto 20 digits"}),

    id: z
    .string({required_error: "Id required"})
    .trim()
    .min(3, {message: "Place must be atleast 3 characters"})
    .max(255, {message: "Place must not be greater than 255 characters"}),

})
const passwordSchema = z.object({

    currentPassword: z
    .string({required_error: "Password required"})
    .trim()
    .min(7, {message: "Password must contain atleast 7 characters"})
    .max(1024 , {message: "password can max out at 1024 characters"}),

    password: z
    .string({required_error: "Password required"})
    .trim()
    .min(7, {message: "Password must contain atleast 7 characters"})
    .max(1024 , {message: "password can max out at 1024 characters"}),

    confirmPassword: z
    .string({required_error: "Password required"})
    .trim()
    .min(7, {message: "Password must contain atleast 7 characters"})
    .max(1024 , {message: "password can max out at 1024 characters"}),

})

const forgotPasswordSchema = z.object({

    email: z
    .string({required_error: "email required"})
    .trim()
    .min(3, {message: "Email must be atleast 3 characters"})
    .max(255, {message: "Email must not be greater than 255 characters"}),

    password: z
    .string({required_error: "Password required"})
    .trim()
    .min(7, {message: "Password must contain atleast 7 characters"})
    .max(1024 , {message: "password can max out at 1024 characters"}),

    confirmPassword: z
    .string({required_error: "Password required"})
    .trim()
    .min(7, {message: "Password must contain atleast 7 characters"})
    .max(1024 , {message: "password can max out at 1024 characters"}),

})

module.exports = {registerSchema, loginSchema, addContactSchema, updateSchema, updateMainSchema, passwordSchema, forgotPasswordSchema}