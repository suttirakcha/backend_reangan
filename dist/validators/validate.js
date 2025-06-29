import createError from "../utils/create-error.util.js";
const validate = (schema, options = {}) => async (req, res, next) => {
    try {
        const result = await schema.parse(req.body, { abortEarly: false, ...options });
        req.body = result;
        next();
    }
    catch (err) {
        const errors = err.errors.map((error) => error.message);
        throw createError(400, errors.join(","));
    }
};
export default validate;
