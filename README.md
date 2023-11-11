# Validator Module
A simple and fast Node.js module for validating incoming data against specified schemas.

## Usage
1. Install the module using npm:
   ```bash
npm install your-validator-module-name

2. Import the module in your Node.js application:
```javascript
const { createValidator } = require('simple-validator');
```

3. Create a schema for your data using the createValidator function:
```javascript
const schema = createValidator({
    // Define your schema here
});
```

4. Validate your data using the created schema:
```javascript
const data = {
    // Your data to be validated
};

const validationResult = schema(data);
console.log(validationResult);
```

5. The `validationResult` will be an object with `{ match: true }` if the data matches the schema or `{ match: false, error: ... }` if there is a validation error.

## Schema Definition
Define your schema using the following structure:
```javascript
const schema = createValidator({
    fieldName: { type: 'String', required: true, minLength: 3, maxLength: 10 },
    // Add more fields and their validation rules as needed
});
```
Available types: 'String', 'Number', 'Enum', 'Array', 'Double'.

## Example
```javascript
const { createValidator } = require('simple-validator');
const postSchema = createValidator({
    author: { type: 'String', required: true, minLength: 5, maxLength: 24 },
    comments: {
        type: 'Array',
        required: true,
        itemValidator: (item) => createValidator({
            user: { type: 'String', required: true },
            text: { type: 'String' },
        })(item),
    },
    private: { type: 'Enum', enum: ['yes', 'no'] },
    postId: { type: 'Number', required: true },
    availableAges: { type: 'Number', min: 0, max: 90, required: true },
});

const post = { // It's a perfect match!
    author: 'Zarubin',
    comments: [{user: "User №1", text: "cool"},{user: "User №2", text: "hey"}],
    private: 'yes',
    postId: 390,
    availableAges: 29
};
const post2 = { // Mismatch
    author: 49231, // need String
    comments: [{user: "User №1", text: ""},{user: "User №2", text: "hey"}], // text can be null
    private: 'yes',
    // no postId
    availableAges: 91 // max 90
};
const result = postSchema(post);
console.log(result); // returns: {match: true}
const result2 = postSchema(post2);
console.log(result2); // returns {match: false,error: "Field 'author' has an invalid type. Expected a string."}
```

## Links
1. Telegram chat: [Visit our chat](https://t.me/zadevv) - here you can get help.
2. Telegram channel of the studio: [ZA Development Studio](t.me/za_it)
3. Find the creator in telegram: [@ArtemiyZarubin](https://t.me/ArtemiyZarubin)