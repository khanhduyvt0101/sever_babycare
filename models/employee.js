let mongoose = require('mongoose');

// Employee Schema
const Employee = mongoose.model(
    'Employee',
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            salary: {
                type: String,
                required: true,
            },
        },
        { versionKey: false, collection: 'employees' }
    )
);

module.exports = { Employee };
