const passport = require("passport");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const UserModel = require("../models/user.model.js");

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Utiliza ExtractJwt.fromExtractors para extraer el token de la cookie
        secretOrKey: "tokenProyect"
    }, async (jwt_payload, done) => {
        try {
            // Busca el usuario en la base de datos usando el ID del payload JWT
            const user = await UserModel.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user); // Devuelve el usuario encontrado
        } catch (error) {
            return done(error);
        }
    }));
}
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
   // console.log("Extracted token: ", token);   Agrega este log para verificar el token
    return token;
}

module.exports = initializePassport;   