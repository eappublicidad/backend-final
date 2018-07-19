/* global expect */

let frisby = require("frisby"),
    Joi = frisby.Joi,
    ramdom = require('randomstring');

//se prueba con los datos del super admin
let user = {
    "email": ramdom.generate(12) + '@example.com',
    "password": ramdom.generate(8),
    "firstName": "Pedro",
    "lastName": "Perez",
    "birthday": "2017-06-25 12:00:00"
}

it('User Register Normal', () => {
    return frisby
        .post("http://localhost:3000/user/save", user)
        .expect('status', 200)
        .expect('header', 'Content-Type', 'application/json; charset=utf-8')
        .expect('jsonTypes', 'content.?', { command: 'model', type: 'user' })
        .expect('json', 'status', true)
        .expect('json', 'content[0]', { command: 'message', type: 'info', content: 'user registrado' })
        .then(res => {
            var obj = res.json;
            expect(obj.content[1]).toBeDefined();
            expect(obj.content[1].content).toBeDefined();

            var returnedUser = obj.content[1].content

            expect(returnedUser.id).toMatch(/\d+/);
            expect(returnedUser.firstName).toEqual(user.firstName);
            expect(returnedUser.lastName).toEqual(user.lastName);
            expect(returnedUser.email).toEqual(user.email);
            expect(returnedUser.password).toEqual("*****");

            return frisby
                .post("http://localhost:3000/user/login", user)
                .expect('status', 200)
                .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                .expect('json', 'status', true)
                .then(res => {
                    var obj = res.json;
                    expect(obj.content).toBeDefined();

                    var returnedUser = obj.content

                    expect(returnedUser.id).toMatch(/\d+/);
                    expect(returnedUser.firstName).toEqual(user.firstName);
                    expect(returnedUser.lastName).toEqual(user.lastName);
                    expect(returnedUser.email).toEqual(user.email);
                    expect(returnedUser.password).toEqual("*****");
                    expect(returnedUser.token).toMatch(/\w{64}/);
                });
        });
}); 