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
                .post('/api/issues/apitest')
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
                    
                });
                done();
            });
            test("Create an issue with only required fields: POST request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .post('/api/issues/apitest')
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
                    
                });
              done();  
            })
            test("Create an issue with missing required fields: POST request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .post('/api/issues/apitest')
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
            test("View issues on a project: GET request to /api/issues/apitest", function(done){
                chai
                .request(server)
                .get('/api/issues/apitest')
                .end(function(err,res){
                    assert.equal(res.status,200);
                    // assert.equal(res.body.length,25);
                })
                done();
            });
            test("View issues on a project with one filter: GET request to /api/issues/apitest", function(done){
                chai
                .request(server)
                .get('/api/issues/apitest')
                .query({
                    _id:"63b4d3de9a7a573b57568d15"
                })
                .end(function (err,res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        "issue_title": "pictures",
                        "issue_text": "text about pictures",
                        "created_on": "2023-01-04T01:18:22.755Z",
                        "updated_on": "2023-01-04T01:28:46.494Z",
                        "created_by": "fCC",
                        "assigned_to": "Dom",
                        "open": true,
                        "status_text": "Not Done",
                        "_id": "63b4d3de9a7a573b57568d15"
                    })

                })
                done();                
            });
            test("View issues on a project with multiple filters: GET request to /api/issues/apitest", function(done){
                chai
                .request(server)
                .get('/api/issues/apitest')
                .query({
                    _id: "63b4d3de9a7a573b57568d15",
                    issue_title: "pictures",
                    issue_text: "text about pictures"
                })
                .end(function(err,res){
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        "issue_title": "pictures",
                        "issue_text": "text about pictures",
                        "created_on": "2023-01-04T01:18:22.755Z",
                        "updated_on": "2023-01-04T01:28:46.494Z",
                        "created_by": "fCC",
                        "assigned_to": "Dom",
                        "open": true,
                        "status_text": "Not Done",
                        "_id": "63b4d3de9a7a573b57568d15"
                    })
                })
                done();
            });
        });
        suite('PUT request tests', function(){
            test("Update one field on an issue: PUT request to /api/issues/apitest", function(done){
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: "63b4d3de9a7a573b57568d17",
                    issue_title: "Issue changed ",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, "63b4d3de9a7a573b57568d17")

                })
                done();                
            });
            test("Update multiple fields on an issue: PUT request to /api/issues/apitest", function(done){
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: "63b4d1971e0016916dd9a3de",
                    issue_title: "pictures",
                    issue_text: "text about pictures"
                })
                .end(function(err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully updated");
                    assert.equal(res.body._id, "63b4d1971e0016916dd9a3de");
                })
                done();                
            });
            test("Update an issue with missing _id: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    issue_title:"update",
                    issue_text:"updated issue"
                })
                .end(function (err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                })
                done();
            });
            test("Update an issue with no fields to update: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id:"63b2fb1f67a84a3c8ea68110"
                })
                .end(function (err,res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "no update field(s) sent");
                })
                done();
            });
            test("Update an issue with an invalid _id: PUT request to /api/issues/get-put-test", function(done){
                chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: "63b2fb2a67a84a3c8ea6811",
                    issue_title: "new update",
                    issue_text: "updating issue"
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "could not update");
                })
                done();
            });
        })

        suite('DELETE request tests', function() {
            test("Delete an issue: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/apitest")
                .send({
                    _id: deleteID
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully deleted");
                })
                done();
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
                })
                done();
            });
            test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function(done){
                chai
                .request(server)
                .delete("/api/issues/apitest")
                .send({})
                .end(function (err, res){
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "missing _id");
                })
                done();
            });
        })
    })
});
