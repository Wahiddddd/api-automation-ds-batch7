const { test, expect } = require("@playwright/test");
const Ajv = require("ajv-draft-04"); // Gunakan ajv-draft-04
const { describe } = require("node:test");

const ajv = new Ajv();

test('Test Get Single User', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2');
    expect(response.status()).toBe(200);

    const responseData = await response.json();

    expect(responseData.data.id).toBe(2);
    expect(responseData.data.email).toBe("janet.weaver@reqres.in");

    // Validasi menggunakan AJV
    const schema = require('./jsonshema/get-object-schema.json');
    const valid = ajv.validate(schema, responseData);

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
    }

    expect(valid).toBe(true);
});


// test.describe('Positive test case',() => {
    
// });

test('Test Post Create User', async ({request}) => {
    const bodyData = {
        "name": "morpheus",
        "job": "leader"
    }
    const headerData = {
        Accept: 'application/json'
    }
    const response = await request.post('https://reqres.in/api/users', {
        headers: headerData,
        data: bodyData
    })

    expect(response.status()).toBe(201)
    const responseData = await response.json();

    expect(responseData.name).toBe("morpheus");
    expect(responseData.job).toBe("leader");

    const schema = require('./jsonshema/post-create-chema.json');
    const valid = ajv.validate(schema, responseData);

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
    }

    expect(valid).toBe(true);


});

test('Test Put Update User', async ({ request }) => {
    // Data yang akan dikirim
    const updateData = {
        "name": "morpheus",
        "job": "zion resident"
    };

    const response = await request.put('https://reqres.in/api/users/2', {
        data: updateData,
        headers: {
            Accept: 'application/json',
        },
    });

    // Validasi status kode
    expect(response.status()).toBe(200); // Status kode yang benar untuk PUT adalah 200

    // Parse respons JSON
    const responseData = await response.json();

    // Validasi data yang diterima
    expect(responseData.name).toBe("morpheus");
    expect(responseData.job).toBe("zion resident");

    const schema = require('./jsonshema/put-update-schema.json');
    const valid = ajv.validate(schema, responseData);

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
    }

    expect(valid).toBe(true);
});


test('Test Delete User', async ({ request }) => {
    // Kirim permintaan DELETE
    const response = await request.delete('https://reqres.in/api/users/2');

    // Validasi status kode
    expect(response.status()).toBe(204); // 204 berarti berhasil dihapus, tanpa respons body
});
