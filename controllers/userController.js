import { getAllUsers, getServerTime } from '../models/userModel.js';

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

// Get server time
export const getTime = async (req, res) => {
    try {
        const time = await getServerTime();
        res.json({
            success: true,
            time: time
        });
    } catch (error) {
        console.error('Get time error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get server time'
        });
    }
};