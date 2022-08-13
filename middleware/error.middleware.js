
const { logger } = require('../utils/logger')
class ValidationError extends Error{
	constructor(
		message,
		details
	) {
		super(message)
		this.code = 400; // Bad request
		this.details = details;
	}
}
/*
Error attributes from dynamo query. You could check it by console.log(error) in db.js
	'message',
	'code',
	'time',
	'requestId',
	'statusCode',
	'retryable',
	'retryDelay' 
*/
class QueryDbError extends Error{
	constructor(error) {
		super(error.message);
		this.time = error?.time;
		this.code = error?.code;
		this.requestId = error?.requestId;
		this.statusCode = error?.statusCode;
		this.retryable = error?.retryable;
		this.retryDelay = error?.retryDelay;
	}
}
class OperationalError extends Error {
	constructor(
		message, 
		code
	) {
		super(message);
		this.code = code
	}
}
/* const errorMiddleware = (error, req, res, next) => {
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
 */
/* 
Strategy: log db query errors and other unexpected errors only
For these errors, no need to let clients know details, it should sent to clients as 500 error
For validation errors, it should be sent to client with details 
*/
const errorHandler = (err, req, res, next) => {
	if (res?.headersSent) return next(err);
	// Default body error
	let bodyError = {
		message: 'Internal error',
		status: 500
	}

	if( err instanceof ValidationError) {
		bodyError = {
			message: err.message,
			status: err.code,
			details: err.details
		}
	}
	else if(err instanceof QueryDbError) {
		logger.error(`DATABASE QUERY: [${req.method}] ${req.path} >> DynamoCode:: ${err?.statusCode}, Message:: ${err.message},\nDetails:\n	time: ${err?.time},\n	code: ${err?.code}\n	requestId: ${err?.requestId},\n	retryable: ${err?.retryable},\n	requestDelay: ${err?.requestDelay},\n	stack trace: ${err?.stack}`)
	}
	else {
		logger.error(`OPERATIONAL: [${req.method}] ${req.path} >> StatusCode:: ${err?.code}, Message:: ${err.message},\n Stack trace: ${err?.stack}  `)
	}

	res.status(bodyError.status).json(bodyError)

}
module.exports = { errorHandler, ValidationError, OperationalError, QueryDbError }
