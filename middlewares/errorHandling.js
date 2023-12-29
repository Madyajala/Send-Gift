

async function errorHandler(err, req, res, next) {
    let statusCode = 500
    let message = 'Internal Server Error'
    // console.log(err, '<<<<')
    switch (err.name) {
        case 'SequelizeValidationError':
                statusCode = 400
                message = err.errors[0].message
            break;
        case 'SequelizeUniqueConstraintError':
            statusCode = 400
            message = 'Email must be unique'
            break;
        case "Email/Password Is Wrong":
        case "JsonWebTokenError":
                statusCode = 401
                message = 'Invalid email/password'
            break
        case "Unauthentication":
                statusCode = 401
                message = 'Please Login Again'
            break
        case "Forbidden Acces":
                statusCode = 403
                message = 'Cannot Acces'
            break
        case 'Not Found':
                statusCode = 404
                message = 'Data Not Found'
            break;
        // default:
        //     res.status(500).json({
        //         message : 'Internal Server Error'
        //     })
        //     break;
    }
    res.status(statusCode).json({ message })
}

module.exports = errorHandler