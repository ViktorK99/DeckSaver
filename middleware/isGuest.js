const isGuest = (req, res, next) => {
    if(req.cookies['connect.sid']) {
        return res.redirect('/discord/decks')
    }
    next();
}

module.exports = isGuest;