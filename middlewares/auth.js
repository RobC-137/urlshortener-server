function auth(tokenVerifier) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {

            try {
                const user = tokenVerifier(token, process.env.ACCESS_TOKEN_SECRET)
                res.locals.user = user;
            } catch (error) {
                error.status = 401;
                next(error)
            }
        } else {
            const error = new Error('No Token')
            error.status = 401;
            next(error)
        }
        next()
    }
}

module.exports = {
    authMidleware: auth
} 