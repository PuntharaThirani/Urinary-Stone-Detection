const request = require('supertest');
const app = require('../server');
const path = require('path');
const fs = require('fs');

describe('📤 Upload API Tests', () => {

    const filePath = path.join(__dirname, 'test-image.jpg');
    
    beforeAll(() => {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, 'dummy content'); 
        }
    });

    it('should upload an X-ray image', async () => {
        const res = await request(app)
            .post('/api/upload')
            .attach('image', filePath);

        // 👇 මෙන්න මේ පේළිය තමයි වෙනස් කළේ
        expect([200, 201]).toContain(res.statusCode); 
        
        expect(res.body).toHaveProperty('message', 'File uploaded successfully!');
    });

    afterAll(() => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
});