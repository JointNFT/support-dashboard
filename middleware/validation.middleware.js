const { ValidationError } = require('./error.middleware');
// query for query string in URL
// body for body request in post/patch request
// values in these objects are must-have values
// note: key : param name
// value: param value
const exampleParams = {
    query: { organizationId: 'number'}, // => that means organizationID is a mandatory params and it's type is number
    body: { name: 'string' } 
}
const TYPE = {
    NUMBER: 'number',
    STRING: 'string',
    OBJECT: 'object',
    BOOLEAN: 'boolean',
    ANY: 'any'
}
const validateParams = ({ query, body }) => (req, res, next)  => {
    try {
        const error = {
            message: 'Invalid params',
            code: 400,
            details: []
        }
        // Handle query string
        if(query && Object.keys(query).length > 0) {
            error.details = Object.entries(query).reduce((acc, entry) => {
                const [ key, value ] = entry;
                if(!req.query?.[key]) {
                    acc.push(`${key} required`)
                } 
                else if (value === TYPE.ANY) {}
                else if(typeof req.query?.[key] !== value) {
                    acc.push(`${key} is invalid. It should be a ${value}`)
                }
                return acc;
        }, []);
        }
         // Handle body 
         if(body && Object.keys(body).length > 0) {
            error.details = Object.entries(body).reduce((acc, entry) => {
                const [ key, value ] = entry;
                if(!req.body?.[key]) {
                    acc.push(`${key} required`)
                } 
                else if (value === TYPE.ANY) {}
                else if(typeof req.body?.[key] !== value) {
                    acc.push(`${key} is invalid. It should be a ${value}`)
                }
                return acc;
        }, [...error.details]);
        }
        
        if(error.details.length > 0) {
            throw new ValidationError(error.message, error.details)
        } else {
            next()
        }
    } catch(error) {
        next(error)
    }
}

module.exports = { validateParams, TYPE};