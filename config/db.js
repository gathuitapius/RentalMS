import { Pool } from 'pg';
import { hashMyPassword, decodedPassword } from '../utils.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'
dotenv.config()

let PORT=process.env.PORT;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5433,
})



export const GetTime = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Current time from PostgreSQL:', res.rows[0].now);
        return res.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}


export const GetUsers = async () => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        if (allUsers.rows.length === 0)
            {
                console.log("No users found in the database.")
                return []
            }
        console.log(allUsers.rows[0]);  
        return allUsers.rows;
    } catch (error) {
        console.log("Error fet:", error.message);
    }

}


export const registerUsers = async (name, role, email, password) => {
    const defaultRole = 'tenant';
    const defaultIsAdmin = false;
    const passwordHash =  await hashMyPassword(password);
    console.log("Hashed Password:" + passwordHash);
    try {
        const sql = `
            INSERT INTO users (displayname, role, email, is_admin, user_password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, displayname, role, email, is_admin; 
            -- Note: NEVER return the user_password hash in the response.
        `;

        const newUserResult = await pool.query(sql, [
            name, 
            role || defaultRole, 
            email, 
            defaultIsAdmin, 
            passwordHash
        ]);
        return newUserResult.rows[0];
    } catch (error) {
        console.error("Error registering new user:", error.message, error.stack);
        throw new Error("Registration failed due to a database error.");
    }

}


export const LoginUser = async (email, password, req, res ) => {
    console.log(email, password)
    try {
        const sql = `SELECT user_id, displayname, email, role, user_password FROM users WHERE email = $1;`
        const userdata = await pool.query(sql, [email]);

        //1. check if credentials are valid
        if (userdata.rows.length === 0){
            throw new Error('Inavlid email or Password, try again');
        }
        // get the user details
        const user = userdata.rows[0];

        // check if user password is valid
        const isValidPassword = await decodedPassword(password, user.user_password);

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        if (!jwtSecretKey) {
            return res.status(500).json({
                success: false,
                message: "Server configuration Error"
            });
        }

        const tokenPayload = {
            userId: user.user_id,
            email: user.email,
            role: user.role,
            name: user.displayname
        }

        const token = jwt.sign(tokenPayload,jwtSecretKey,{
            expiresIn: '24h' //expires in 24 hours
        });
        console.log('Login Succesfull');
        return res.json({
            success: true,
            message: "Login Successful",
            token: token,
            user: {
                id: user.user_id,
                name: user.displayname,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {
        console.log('Error logging user');
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}




