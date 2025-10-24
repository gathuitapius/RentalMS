import jwt from 'jsonwebtoken';
import { validateUserCredentials, createUser } from '../models/userModel.js';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.user_id,
            email: user.email,
            role: user.role,
            name: user.displayname
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '24h' }
    );
};

// Login controller
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Validate credentials
        const user = await validateUserCredentials(email, password);

        // Generate token
        const token = generateToken(user);

        // Return response
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.user_id,
                name: user.displayname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

// Register controller
export const register = async (req, res) => {

    try {
        const { name, role, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }
        console.log("New User about to be created!")
        //let strpassword = password.toString()

        // Create user
        const newUser = await createUser(name, role, email, password.toString());
        console.log("New User: " + newUser)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Registration error:', error.message);
        
        // Handle duplicate email error
        if (error.code === '23505') { // PostgreSQL unique violation
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

// Generate token endpoint (for testing)
export const generateTestToken = (req, res) => {
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        
        if (!jwtSecretKey) {
            return res.status(500).json({
                success: false,
                message: 'JWT secret key not configured'
            });
        }

        const data = {
            time: Date(),
            userId: 12,
        };

        const token = jwt.sign(data, jwtSecretKey);
        
        res.json({
            success: true,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Token generation failed'
        });
    }
};