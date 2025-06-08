import jwt from 'jsonwebtoken';

export const googleCallback = (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
    });

    res.redirect(process.env.FRONTEND_URL);
};

export const getUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ error: 'Error while fetching user!' });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
};
