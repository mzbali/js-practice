const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.statics.verifyUser = async function (username, password) {
    const user = await this.findOne({ username });
    const isVerified = await bcrypt.compare(password, user.password);
    return isVerified ? user : false; //return the user as we might want do something with it like saving the user._id in session
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //if password not modified then just save
    this.password = await bcrypt.hash(this.password, 12); //if not hash it
    next();
});

module.exports = mongoose.model('User', userSchema);