const ids = require('./../config/admin_whiltelist.json')

const checkId = (ctx, next) => {
    const tId = ctx.update.message.chat.id

    ids.find((val) => {
        if (val.telegram_id === tId){
            ctx.session.isAdmin = true
            next()
        }
    })
    next(new Error("No Telegram Admin with this ID"))
}