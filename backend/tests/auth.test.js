const request  = require('supertest');
const app      = require('../server');
const mongoose = require('mongoose');
const User     = require('../models/User');

let authToken = ''; // Store token for protected route tests


// Before all tests — clean test user

beforeAll(async () => {
  await User.deleteMany({ 
    email: {
      $in: [
        'testuser@example.com',
        'testdoctor@example.com',
      ]
    }
  });
});


// After all tests — close DB connection

afterAll(async () => {
  await mongoose.connection.close();
});


describe('🔐 Auth API Tests', () => {


  // 1. Register — Patient
 
  it('should register a new patient user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name:     'Test User',
        email:    'testuser@example.com',
        password: 'password123',
        role:     'patient',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User registered successfully'); 
  });

  
  // 2. Register — Doctor

  it('should register a new doctor user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name:     'Test Doctor',
        email:    'testdoctor@example.com',
        password: 'password123',
        role:     'doctor',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });


  // 3. Register — Duplicate Email

  it('should not register with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name:     'Test User 2',
        email:    'testuser@example.com', // Same email
        password: 'password123',
        role:     'patient',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User already exists');
  });

 
  // 4. Register — Missing Fields

  it('should not register without required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'incomplete@example.com',
        // name and password missing
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  
  // 5. Login — Success
  
  it('should login successfully and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email:    'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role');
    expect(res.body.role).toBe('patient');

    // Save token for later tests
    authToken = res.body.token;
  });


  // 6. Login — Wrong Password
  
  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email:    'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });


  // 7. Login — Non-existent Email

  it('should not login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email:    'notexist@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

 
  // 8. Get Profile — With Token

  it('should get user profile with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
    expect(res.body.user).not.toHaveProperty('password'); // Password hidden
  });

 
  // 9. Get Profile — Without Token

  it('should not get profile without token', async () => {
    const res = await request(app)
      .get('/api/auth/profile');

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });


  // 10. Verify Token
 
  it('should verify valid token', async () => {
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

 
  // 11. Admin Role Cannot Self-Register
 
  it('should not allow admin role self-registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name:     'Fake Admin',
        email:    'fakeadmin@example.com',
        password: 'password123',
        role:     'admin', // Should be blocked
      });

    expect(res.statusCode).toEqual(201);
    // Role should be defaulted to 'patient'
    expect(res.body.success).toBe(true);

    // Verify role in DB
    const user = await User.findOne({ 
      email: 'fakeadmin@example.com' 
    });
    expect(user.role).toBe('patient'); //  Not admin
  });

});