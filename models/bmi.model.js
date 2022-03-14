import mongoose from 'mongoose'
const { Schema } = mongoose;

const userSchema = new Schema({
    type: {
        type: String,
        require: true,
    },
    idBaby: {
        type: String,
        require: true,
    },
    value: {
        type: Number,
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

const BMI = mongoose.model('bmi', userSchema);
export default BMI;