const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')

async function register(req, res) {
    try {
        const { firstname, lastname, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role: "USER"
            }
        })
        res.json({ user, message: "User registered successfully", status: 200, success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', status: 500, success: false })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 404, success: false })
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password', status: 401, success: false })
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.json({ user, token, message: "User logged in successfully", status: 200, success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', status: 500, success: false })
    }
}

async function getUser(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                role: true
            }
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 404, success: false })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.json({ user, token, message: "User profile fetched successfully", status: 200, success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error', status: 500, success: false })
    }
}

module.exports = { register, login, getUser }