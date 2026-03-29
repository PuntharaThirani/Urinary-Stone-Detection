const request = require('supertest');
const app = require('../server'); // අපි හදපු Server එක ගන්නවා
const mongoose = require('mongoose');
const User = require('../models/User');

// Test කරන්න කලින් පරණ User කෙනෙක් හිටියොත් මකනවා
beforeAll(async () => {
    await User.deleteMany({ email: 'testuser@example.com' });
});

// Test කරලා ඉවර වුනාම Database Connection එක නවත්වනවා
afterAll(async () => {
    await mongoose.connection.close();
});

describe('🔐 Auth API Tests', () => {
    
    // 1. Register වෙන්න පුළුවන්ද බලනවා
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'patient'
            });
        
        expect(res.statusCode).toEqual(201); // 201 කියන්නේ සාර්ථකයි
        expect(res.body).toHaveProperty('message', 'User registered successfully!');
    });

    // 2. Login වෙන්න පුළුවන්ද බලනවා
    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200); // 200 කියන්නේ සාර්ථකයි
        expect(res.body).toHaveProperty('token'); // Token එකක් ලැබුනද බලනවා
    });

    // 3. වැරදි Password ගැහුවම Fail වෙනවද බලනවා
    it('should not login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400); // 400 කියන්නේ Error එකක්
    });
});