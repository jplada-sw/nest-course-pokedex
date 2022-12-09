import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB_CON: Joi.required(),
    PORT: Joi.number()
});