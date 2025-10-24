import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// Password comparison helper
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Find user by email
export const findUserByEmail = async (email) => {
    const sql = `SELECT user_id, displayname, email, role, user_password FROM users WHERE email = $1;`;
    const result = await pool.query(sql, [email]);
    return result.rows[0];
};

// Validate user credentials
export const validateUserCredentials = async (email, password) => {
    const user = await findUserByEmail(email);
    
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isValidPassword = await comparePassword(password, user.user_password);
    
    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }

    // Return user without password
    const { user_password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Create new user
export const createUser = async (name, role, email, password) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const sql = `
        INSERT INTO users (displayname, role, email, user_password)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, displayname, email, role;
    `;
    
    const result = await pool.query(sql, [name, role, email, passwordHash]);
    return result.rows[0];
};

// Get all users
export const getAllUsers = async () => {
    const sql = `SELECT user_id, displayname, email, role FROM users;`;
    const result = await pool.query(sql);
    return result.rows;
};

// Get server time
export const getServerTime = async () => {
    const result = await pool.query('SELECT NOW() as time');
    return result.rows[0];
};