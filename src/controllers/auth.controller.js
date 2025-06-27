import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';

export const googleCallback = (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role, email: req.user.email, name: req.user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;


        // 1. Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // 2. Check for existing user
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create and save user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: 'user',
        });

        await newUser.save();

        // 5. Sign JWT token
        const token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role,
                email: newUser.email,
                name: newUser.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 6. Set token in cookie
        res.cookie('token', token, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 7. Send response
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if user was registered via Google OAuth
        if (!user.password) {
            return res.status(403).json({ error: 'This email is registered via Google. Please log in using Google Sign-In.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(
            user
        );

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


