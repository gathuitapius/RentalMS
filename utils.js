import bcrypt from 'bcrypt';

export const hashMyPassword = async (password) => {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw new Error('Password hashing failed');
    }
}

export const decodedPassword = async (password, hashedPassword) => {
    try {
        const result = await bcrypt.compare(password, hashedPassword);
        return result;
    } catch (error) {
        return false;
    }
}