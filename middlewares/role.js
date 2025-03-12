const mecanicienMiddleware = (req, res, next) => {
    if (req.user.role !== 'mecanicien') {
        return res.status(403).json({ message: 'Accès interdit' });
    }
    next();
};

const managerMiddleware = (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Accès interdit' });
    }
    next();
};


module.exports = mecanicienMiddleware;
module.exports = managerMiddleware;
