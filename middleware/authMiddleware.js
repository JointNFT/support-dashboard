function authentication(req, res, next) {
    if(req?.session?.siwe?.address) return next()
    else {
       res.status(401).json({
        error: 'Authentication required'
       })
    }
}

module.exports.authentication = authentication;