const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        default: 0,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be greater than zero');
            }
        },
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!(value.length > 6)) {
                throw new Error('Password must be at least 6 characters');
            } else if (value.includes('password')) {
                throw new Error('Password mut not contained in password field');
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});
userSchema.statics.findbyCredentials = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user found');
    const matchFound = await bcrypt.compare(password, user.password);
    if (!matchFound) throw new Error("Passwords didn't match");
    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'lukamodric');

    // Save the token to the user object
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};
userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
};

/* UserSchema pre or post */
userSchema.pre('save', async function (next) {
    const user = this; //individiual users are referenced with this keyword

    // console.log('Just before saving');

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
