const mongoose = require('mongoose')
require('dotenv').config()

 
const MongoDb = function () {
    mongoose.connect(process.env.MONGO_CONN).then(() => {
            console.log("MongoDb Connected from telegram server")
        })
}

//Session Schema
const sessionSchema = new mongoose.Schema({
    tgId: {
        type: String, //this is not a number, make it string
        required: [true, "Telegram ID must be given"],
        unique: true
    },
    data: {
        role:{
            type: Number,
            required: [true, "Role Number must be given"]
        },
        token: {
            type: String,
            required: [true, "Telegram token must be given"]
        },
        expiration: {
            type: Date, //this is good
            required: [true, "Expiration time must be given"]
        },
        issued_time: {
            type: Date,
            dafault: Date.now() //beautiful
        }
    }
})
const Sessions = mongoose.model('session', sessionSchema)


//Function that add/updates a session to/in the database
MongoDb.prototype.addSession = async function(_id, key, data, callback){
    // const tgId = key.split(':')[1]
    const sessionFind = await Sessions.findOne({ key })

    if(sessionFind.length == 0){
        await Sessions.create({
            key,
            data
        }).then((data) => {
            const ret = {
                status: true,
                result: {
                    msg: "New session added to the db",
                    data
                }
            }
            return callback(ret)
        }).catch((error) => {
            ret = {
                status: false,
                result: {
                    msg: error.message || "Error while adding the session to the database",
                    error
                }
            }
            return callback(ret)
        })
    } else {
        await Sessions.findOneAndUpdate({ key }, { _id, key, data})
            .then((data) => {
                const ret = {
                    status: true,
                    result: {
                        msg: "Session updated on the db",
                        data
                    }
                }
                return callback(ret)
            }).catch((error) => {
                ret = {
                    status: false,
                    result: {
                        msg: error.message || "Error while adding the session to the database",
                        error
                    }
                }
                return callback(ret)
            })
    }
}

MongoDb.prototype.removeSesseion = async function (key, callback){
    // const tgId = key.split(':')[1]

    await Sessions.findOneAndRemove({ key })
        .then((data) => {
            const ret = {
                status: true,
                result: {
                    msg: `Session of user ${key} has been removed.`,
                    data
                }
            }
            return callback(ret)
        }).catch((error) => {
            const ret = {
                status: false,
                result: {
                    msg: error.message || "Error finding or removing the sessin from the database",
                    error
                }
            }
            return callback(ret)
        })
}

MongoDb.prototype.getSession = async function (key, callback)  {
    // const tgId = key.split(':')[1]

    await Sessions.findOne({ key })
        .then((data) => {
            const ret = {
                status: true,
                result: {
                    msg: "Successfuly retured the session of the user",
                    data
                }
            }
            return callback(ret)
        }).catch((error) => {
            const ret = {
                status : false,
                result: {
                    msg: error.message || "Can not get session from the db",
                    error
                }
            }
            return callback(ret)
        })

}

const db = new MongoDb()

module.exports = { db }