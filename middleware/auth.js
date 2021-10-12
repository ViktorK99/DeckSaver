const authenticate = (req, res, next) => {
    const token = req.cookies['connect.sid'];
    if(token) {
        req.isLoggedIn = true;
        next();
    } else {
        res.redirect('/home');
    };
}
module.exports = authenticate;