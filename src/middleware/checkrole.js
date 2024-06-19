const jwt = require('jsonwebtoken');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.CookieProyectTest;

    if (token) {
        jwt.verify(token, 'tokenProyect', (err, decoded) => {
            if (err) {
                return res.status(403).send('Acceso denegado. Token inválido.');
            }
            const userRole = decoded.user.role;
            if (allowedRoles.includes(userRole)) {
                req.user = decoded.user;
                next();
            } else {
                res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
            }
        });
    } else {
        res.status(403).send('Acceso denegado. Token no proporcionado.');
    }
};

module.exports = checkUserRole;
