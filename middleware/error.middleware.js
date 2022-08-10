const { logger } = require('../utils/logger')

const errorMiddleware = (error, req, res, next) => {
	try {
		const status = error.status || 500
		const message = error.message || 'Something went wrong'

		logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`)

		if (status === 401) {
			res.setHeader('Set-Cookie', 'Authorization=; Max-age=0')
		}

		res.status(status).json({ message })
	} catch (error) {
		next(error)
	}
}

module.exports = { errorMiddleware }
