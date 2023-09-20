const express = require('express');
const Admin = require('../db/admin-module')
const Course = require('../db/course-module')
const jwt = require('jsonwebtoken')
const { SECRET_KEY, authAdminJwt } = require('../middleware/auth')
const router = express.Router();
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await Admin.findOne({ username });
        if (admin) return res.status(403).json({ message: 'admin already exists' })
        const newAdmin = new Admin({ username, password })
        await newAdmin.save();
        const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY)
        return res.json({ message: 'admin created sussessfully', token });
    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
})

router.get('/me', authAdminJwt, async (req, res) => {
    const username = req.user.username
    const admin = Admin.findById(username);
    if (!username) return res.status(403).json({ message: 'admin not found' });
    return res.json({ message: 'authentication successful', username });
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await Admin.findOne({ username, password });
        if (!admin) return res.status(403).json({ message: 'invalid credentials' });
        const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY);
        res.json({ message: 'successfully loged in', token });
    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
})

router.route('/course')
    .post(authAdminJwt, async (req, res) => {
        try {
            const course = new Course(req.body);
            await course.save();
            res.status(201).json({ message: 'course created successfully' });
        } catch (error) {
            return res.status(401).json({ message: error.message })
        }
    })
    .get(authAdminJwt, async (req, res) => {
        try {
            const course = await Course.find({})
            return res.json({ course })
        } catch (error) {
            return res.status(401).json({ message: error.message })
        }
    })

router.route('/course/:coursId')
    .put(authAdminJwt, async (req, res) => {
        const { coursId } = req.params;
        const course = await Course.findByIdAndUpdate(coursId, req.body, { new: true });
        if (course) return res.json({ message: 'course updated successfully' });
        return res.status(404).json({ message: 'course not found' });
    })
    .get(authAdminJwt, async (req, res) => {
        const { coursId } = req.params;
        const course = await Course.findById(coursId);
        if (course) return res.json({ course })
        res.json({ message: 'course not found' })
    })


module.exports = router;