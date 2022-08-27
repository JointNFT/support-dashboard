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
const checkType = (value, type) => {
    let result = false;
    switch(type) {
        case TYPE.NUMBER:
            result =!isNaN(Number(value)) && typeof value !== TYPE.BOOLEAN ;
            break;
        case TYPE.STRING:
            result = typeof value === TYPE.STRING;
            break;
        case TYPE.BOOLEAN:
            result = value === 'true' || value === 'false' || typeof value === TYPE.BOOLEAN;
            break;
        case TYPE.OBJECT: 
             result = typeof value === TYPE.OBJECT;
             break;
        case TYPE.ANY:
            result = true;
            break;
        default:
        break;
    }
    return result;
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
                else if (!checkType(req.query[key], value)) {
                    acc.push(`${key} is invalid. It should be a ${value}`)
                }
                if(value === TYPE.NUMBER && checkType(req.query[key], TYPE.NUMBER)) {
                    req.query[key] = Number(req.query[key]);
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
                else if (!checkType(req.body[key], value)) {
                    acc.push(`${key} is invalid. It should be a ${value}`)
                }
                if(value === TYPE.NUMBER && checkType(req.body[key], TYPE.NUMBER)) {
                    req.body[key] = Number(req.body[key]);
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