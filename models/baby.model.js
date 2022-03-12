import mongoose from 'mongoose'
const { Schema } = mongoose;
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema({
    birth: {
        type: Date,
        default: Date.now(),
    },
    gender: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    idAccount: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

userSchema.plugin(uniqueValidator, { message: 'Email already in use.' });

const Baby = mongoose.model('baby', userSchema);
export default Baby;
