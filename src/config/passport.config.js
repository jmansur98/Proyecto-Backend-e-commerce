const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");


const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;

        try {
            let user = await UserModel.findOne({email:email});
            if(user) return done(null, false);
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({email});
            if(!user) {
                console.log("Usuario inexistente");
                return done(null, false);
            }
            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

    //Acá vamos a desarrollar nuestra estrategia para GitHub: 
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liYAojZdzcr2ipXY",
        clientSecret: "7815a2ca47e89c5d5868f3a5aad0aca80ae01e99",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile); 
        try {
            let user = await UserModel.findOne({email: profile._json.email});
            if(!user) {
                //Una vez que tengo el nuevo usuario, lo guardo en MongoDB
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport;