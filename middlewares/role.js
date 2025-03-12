const mecanicienMiddleware = (req, res, next) => {
    if (req.user.role !== 'mecanicien') {
        return res.status(403).json({ message: 'Accès interdit pour les utilisateurs non mécanicien' });
    }
    next();
};

const managerMiddleware = (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Accès interdit pour les utilisateurs non manager' });
    }
    next();
};


module.exports = {mecanicienMiddleware,managerMiddleware};
