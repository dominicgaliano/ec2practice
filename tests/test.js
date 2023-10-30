//test.js

const app = require('../index.js');
const supertest = require('supertest');

const fs = require('fs');
const path = require('path');

const requestWithSupertest = supertest(app);

describe('Main endpoint', () => {

  it('GET / should show index.html', async () => {
     const res = await requestWithSupertest.get('/');

    // Check if the HTTP status code is 200 (OK).
    expect(res.status).toEqual(200);

    // Read the content of your index.html file.
    const indexHtmlPath = path.join(__dirname, '../public/index.html');
    const expectedHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Compare the response body with the content of index.html.
    expect(res.text).toEqual(expectedHtmlContent); 
  });

});
