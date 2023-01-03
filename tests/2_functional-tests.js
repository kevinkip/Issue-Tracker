const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;
suite('Functional Tests', function() {
    suite('Routing Tests', function() {
        suite('POST request tests', function(){
            test('Create an issue with every field: POST request to /api/issues/{project}', function(done){
                chai
                .request(server)
                .post('/api/issues/projects')
                .set('content-type', 'application/json')
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "fCC",
                    assigned_to: "Dom",
                    status_text: "Not Done",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    deleteID = res.body._id;
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.issue_text, "Functional Test");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.assigned_to, "Dom");
                    assert.equal(res.body.status_text, "Not Done");
                    done();
                });
            });
            test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .post('/api/issues/projects')
                .set('content-type', 'application/json')
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "fCC",
                    assigned_to: "",
                    status_text: "",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.issue_text, "Functional Test");
                    assert.equal(res.body.created_by, "fCC");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.status_text, "");
                    done();
                });
            })
            test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .post('/api/issues/projects')
                .set('content-type', 'application/json')
                .send({
                    issue_title: "",
                    issue_text: "",
                    created_by: "fCC",
                    assigned_to: "",
                    status_text: "",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                });

            })

        })

        suite('GET request tests', function(){
            test("View issues on a project: GET request to /api/issues/get-request-test", function(done){
                chai
                .request(server)
                .get('/api/issues/get-request-test')
                .end(function(err,res){
                    assert.equal(res.status,200);
                    assert.equal(res.body.length,3);
                    done();
                })
            });
            test("View issues on a project with one filter: GET request to /api/issues/get-request-test", function(done){
                chai
                .request(server)
                .get('/api/issues/get-request-test')
                .query({
                    _id:"63b2f67f7400976d0e667aec"
                })
                .end(function (err,res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        "issue_title": "test1",
                        "issue_text": "sample test 1",
                        "created_on": "2023-01-02T15:21:35.539Z",
                        "updated_on": "2023-01-02T15:21:35.539Z",
                        "created_by": "kevin",
                        "assigned_to": "",
                        "open": true,
                        "status_text": "",
                        "_id": "63b2f67f7400976d0e667aec"
                    })
                    done();
                })
            });
            test("View issues on a project with multiple filters: GET request to /api/issues/get-request-test", function(done){
                chai
                .request(server)
                .get('/api/issues/get-request-test')
                .query({
                    issue_title: "Entry issue",
                    issue_text: "Submitting dates not working. ",
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        "issue_title": "Entry issue",
                        "issue_text": "Submitting dates not working. ",
                        "created_on": "2023-01-02T15:22:12.907Z",
                        "updated_on": "2023-01-02T15:22:12.907Z",
                        "created_by": "kevin",
                        "assigned_to": "",
                        "open": true,
                        "status_text": "",
                        "_id": "63b2f6a47400976d0e667af2"
                    })
                    done();
                })
            });
        });
        suite('PUT request tests', function(){
            test("Update one field on an issue: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/get-put-test')
                .send({
                    _id: "63b2fb1667a84a3c8ea6810a",
                    issue_title: "pictures",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, "63b2fb1667a84a3c8ea6810a")
                    done();
                })
            });
            test("Update multiple fields on an issue: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/get-put-test')
                .send({
                    _id: "63b2fb1f67a84a3c8ea68110",
                    issue_title: "pictures",
                    issue_text: "text about pictures"
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, "63b2fb1f67a84a3c8ea68110");
                    done();
                })
            });
            test("Update an issue with missing _id: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/get-put-test')
                .send({
                    issue_title:"update",
                    issue_text:"updated issue"
                })
                .end(function (err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                })

            });
            test("Update an issue with no fields to update: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/get-put-test')
                .send({
                    _id:"63b2fb1f67a84a3c8ea68110"
                })
                .end(function (err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "no update field(s) sent");
                    done();
                })
            });
            test("Update an issue with an invalid _id: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/get-put-test')
                .send({
                    _id: "63b2fb2a67a84a3c8ea6811",
                    issue_title: "new update",
                    issue_text: "updating issue"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not update");
                    done();
                })
            });
        })

        suite('DELETE request tests', function() {
            test("Delete an issue: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/projects")
                .send({
                    _id: deleteID
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully deleted");
                    done();
                })
            });
            test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/apitest")
                .send({
                    _id: "63b2f67f7400976d0e667aecinvalid",
                })
                .end(function (err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not delete");
                    done();
                })
            });
            test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/apitest")
                .send({})
                .end(function (err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                    done();
                })
            });
        })
    })
});
