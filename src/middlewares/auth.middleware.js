import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const requireRole = (roles = []) => {
    return async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await mongoose.model('User').findById(decoded.id);
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};
