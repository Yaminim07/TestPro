const router = require('express').Router();
const passport = require('passport')
const path = require('path')

const authProfile = function(req, res, next){
    if(!req.user){
        res.redirect('/')
    }else{
        next();
    }
};

router.get('/', authProfile, (req, res) => {
    if(req.user.isHost)
    res.sendFile(path.resolve(__dirname + '../../views/host.html'));
    else
    res.sendFile(path.resolve(__dirname + '../../views/user.html'));

});

module.exports = router;