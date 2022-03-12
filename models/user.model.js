import mongoose from 'mongoose'
const { Schema } = mongoose;
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        require: Date.now(),
    },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    },
});

userSchema.plugin(uniqueValidator, { message: 'Email already in use.' })

const User = mongoose.model('user', userSchema)
export default User
