const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        studentId: {
            type: Number,
        },
        fullName: {
            type: String,
        },
        age: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
)


const User = mongoose.model('User', userSchema);

module.exports = User;