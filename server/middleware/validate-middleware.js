const validate = (schema) =>  async(req, res, next) => {
    try {
        console.log("val",req.body)
        const parseBody = await schema.parseAsync(req.body)
        req.body = parseBody
        next()
    } catch (error) {
        const status = error.status;
        const message = "Fill the input Correctly";
        const extraDetails = error.errors[0].message
        const err = {status, message, extraDetails}
        console.log(err)
        next(err)
    }
}

module.exports = validate