// Imports the server.js file to be tested.
let server = require("../server");
//Assertion (Test Driven Development) and Should, Expect(Behaviour driven development) library
let chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp); 
const { expect } = chai;
var assert = chai.assert;

describe("Tests", () => {
    // Retrieve Test for Avengers Movie
    it('Retrieve "Avengers"', done => {
        chai
            .request(server)
            .get("/get_movie?query=Avengers")
            .end((err, res) => {
                expect(res).to.have.status(200);
                assert.isNotTrue(res.error, 'Error: Does Not Exist');
                assert.include(res.text, 'id="head"', 'No Data Exists');
                assert.notInclude(res.text, 'id="notFound"', 'notFound Exists');
                done();
            });
    });

    // Retrieve Test for movie that does not exist => 13541356435435
    it('Retrieve 13541356435435', done => {
        chai
            .request(server)
            .get("/get_movie?query=13541356435435")
            .end((err, res) => {
                expect(res).to.have.status(200);
                assert.isNotTrue(res.error, 'Error: Does Not Exist');
                assert.notInclude(res.text, 'id="head"', 'Head Exists');
                assert.include(res.text, 'id="notFound"', 'Data Exists');
                done();
            })
    })

    // Retrieve Test for empty string query
    it('Retrieve ""', done => {
        chai
            .request(server)
            .get("/get_movie?query=")
            .end((err, res) => {
                expect(res).to.have.status(200);
                assert.isNotTrue(res.error, 'Error: Does Not Exist');
                assert.notInclude(res.text, 'id="head"', 'Head Exists');
                assert.notInclude(res.text, 'id="notFound"', 'Data Exists');
                assert.include(res.text, 'id="err"', 'Error: Does Not Exist');
                done();
            })
    })
})