// validator.js

const validateString = (value, minLength, maxLength, key) => {
    if (typeof value !== 'string') {
        return `Field '${key}' has an invalid type. Expected a string.`;
    }

    if (minLength !== undefined && value.length < minLength) {
        return `Field '${key}' length should be at least ${minLength}.`;
    }

    if (maxLength !== undefined && value.length > maxLength) {
        return `Field '${key}' length should be at most ${maxLength}.`;
    }

    return null;
};

const validateNumber = (value, min, max, key) => {
    if (typeof value !== 'number') { return `Field '${key}' has an invalid type. Expected a number.`; }
    if (min !== undefined && value < min) { return `Field '${key}' value should be at least ${min}.`; }
    if (max !== undefined && value > max) { return `Field '${key}' value should be at most ${max}.`; }
    return null;
};

const validateDouble = (value, min, max, key) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || isNaN(value)) { return `Field '${key}' has an invalid type. Expected a valid double (number with floating-point).`; }
    if (!/\./.test(value.toString())) { return `Field '${key}' has an invalid value. Expected a valid double (number with floating-point).`; }
    if (min !== undefined && value < min) { return `Field '${key}' value should be at least ${min}.`; }
    if (max !== undefined && value > max+1) { return `Field '${key}' value should be at most ${max}.`; }
    return null;
};

const validateEnum = (value, enumValues, key) => {
    if (!enumValues.includes(value)) { return `Field '${key}' has an invalid value. Expected one of: ${enumValues.join(', ')}.`; }
    return null;
};

const validateArray = (value, itemValidator, key) => {
    if (!Array.isArray(value)) { return `Field '${key}' has an invalid type. Expected an array.`; }
    for (let i = 0; i < value.length; i++) {
        const error = itemValidator(value[i], `${key}[${i}]`);
        if (error) { return error; }
    }

    return null;
};

const createValidator = (schema) => {
    return (data, key) => {
        for (const prop in schema) {
            const { type, minLength, maxLength, enum: enumValues, min, max, required, itemValidator } = schema[prop];
            const value = data[prop];

            if (required && value === undefined) { return { match: false, error: `Field '${prop}' is required.` }; }

            switch (type) {
                case 'String':
                    const stringError = validateString(value, minLength, maxLength, prop);
                    if (stringError !== null) {
                        return { match: false, error: stringError };
                    }
                    break;
                case 'Number':
                    const numberError = validateNumber(value, min, max, prop);
                    if (numberError !== null) {
                        return { match: false, error: numberError };
                    }
                    break;
                case 'Enum':
                    const enumError = validateEnum(value, enumValues, prop);
                    if (enumError !== null) {
                        return { match: false, error: enumError };
                    }
                    break;
                case 'Float':
                case 'Double':
                    const doubleError = validateDouble(value, min, max, prop);
                    if (doubleError !== null) {
                        return { match: false, error: doubleError };
                    }
                    break;
                case 'Array':
                    const arrayError = validateArray(value, createValidator(itemValidator), prop);
                    if (arrayError !== null) {
                        return arrayError;
                    }
                    break;
            }
        }

        return { match: true };
    };
};

module.exports = {
    createValidator,
};
