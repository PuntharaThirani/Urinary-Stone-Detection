const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

let doctorToken = '';


// Before all — create doctor + get token

beforeAll(async () => {
  // Clean existing test doctor
  await User.deleteMany({ 
    email: 'testdoctor.upload@example.com' 
  });

  // Register test doctor
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Upload Test Doctor',
      email: 'testdoctor.upload@example.com',
      password: 'password123',
      role: 'doctor',
    });

  // Login and get token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email:    'testdoctor.upload@example.com',
      password: 'password123',
    });

  doctorToken = loginRes.body.token;

  // Create a minimal valid JPEG test image
  const filePath = path.join(__dirname, 'test-image.jpg');
  if (!fs.existsSync(filePath)) {
    // Minimal JPEG header bytes
    const jpegHeader = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10,
      0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);
    fs.writeFileSync(filePath, jpegHeader);
  }
});


// After all — cleanup

afterAll(async () => {
  // Remove test image
  const filePath = path.join(__dirname, 'test-image.jpg');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await mongoose.connection.close();
});


describe('📤 Upload API Tests', () => {

  const filePath = path.join(__dirname, 'test-image.jpg');

 
  // 1. Upload without token — should fail
 
  it('should not upload without auth token', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('image', filePath);

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });


  // 2. Upload with valid token

  it('should upload an X-ray image with doctor token', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${doctorToken}`)
      .attach('image', filePath);

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(
      'X-ray image uploaded successfully' //  Match controller
    );
    expect(res.body.image).toHaveProperty('filePath');
  });

  
  // 3. Upload without image file
 
  it('should not upload without image file', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${doctorToken}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('No file uploaded');
  });

 
  // 4. Upload wrong file type
 
  it('should not upload non-image files', async () => {
    // Create temp text file
    const txtPath = path.join(__dirname, 'test.txt');
    fs.writeFileSync(txtPath, 'This is not an image');

    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${doctorToken}`)
      .attach('image', txtPath);

    expect(res.statusCode).toEqual(400);

    // Cleanup
    fs.unlinkSync(txtPath);
  });

});