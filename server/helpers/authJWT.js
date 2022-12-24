const jwt = require('jsonwebtoken')
const passport = require('passport')
const Strategy = require('passport-local').Strategy

import bcrypt from 'bcrypt';

const jwtSecret = process.env.JWT_SECRET || 'myjwt'
const adminPassword = process.env.ADMIN_PASSWORD || 'secret'
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' }
import models from '../models/init-models'

//passport.use(adminStrategy())

passport.use(new Strategy(
    async function (user_email, password, cb) {
        try {
            const result = await models.users.findOne({ 
                 where: {
                     email: user_email,
                 }
            });
            if(result == null) return cb(null, { message: 'Incorrect email.' }); 
            const { email, user_id, pass, firstname, lastname} = result.dataValues;
            
            const compare = await bcrypt.compare(password, pass);
            if(!compare) return cb(null, { message: 'Incorrect password.' }); 
            if (compare) return cb(null, { user_email: email, userId: user_id, firstname: firstname,lastname:lastname, message: 'Login success' }); 
        } catch (error) {
            return cb(null, {message:error.message})
        }

        cb(null, false)
    }
))

const authenticate = passport.authenticate('local', { session: false })

module.exports = {
    authenticate,
    login: login,
    refreshToken : refreshToken,
    logout: logout,
    verify: verifytoken
}

async function logout(req, res) {
    res.clearCookie('jwt')
    return res.status(200).json({ message: "Logout success" });
}

async function verifytoken(req, res,next) {
    const token = req.cookies.jwt
    if(!token) return res.status(404).json({ message: "No token provided" });
    try {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if(err) return res.status(404).json({ message: "Invalid token" });
            req.user = decoded.user_name
            next()
        })
    } catch (error) {
        return res.status(404).json({ message: "Token is not valid" });
    }
}


async function login(req, res, next) {
    if(req.user.user_email == null){ 
        res.status(404).json({ success: false, token: null, message: req.user.message });
    } else{ 
        const token = await sign({ user_email: req.user.user_email});
        const { userId, user_email, firstname, lastname} = req.user;

        res.cookie('jwt', token, { httpOnly: true })
        res.status(200).json({ profile: { userId, user_email, firstname,lastname }, success: true, token: token })
    }
}


async function sign(payload) {
    const token = await jwt.sign(payload, jwtSecret, jwtOpts)
    return token
}

async function verify(jwtString = '') {
    jwtString = jwtString.replace(/^Bearer /i, '')
    try {
        const payload = await jwt.verify(jwtString, jwtSecret)
        return payload
    } catch (err) {
        err.statusCode = 404
        throw err
    }
}

async function refreshToken(req, res) {
    try{
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(404).json({ message: "Refresh Token is required!" });
    }catch(err){
        console.log(log)
    }
}
