
var logger = require("log4js").getLogger();
var yelp = require('../util/yelp');
var should = require('should');
var app = require('../server');
var request = require('supertest')
var port = 3000;

describe('GET /', function() {
  it('should return 200', testGetBaseStatusCode);
  it('should return basic OK text in body', testGetBaseBody);
});

function testGetBaseStatusCode() {
  request(app)
    .get('/')
    .expect(200)
    .end(function(err, result) {
      if (err) { throw err; }
    });
}

function testGetBaseBody() {
  request(app)
    .get('/')
    .expect('A-OK')
    .end(function(err, result) {
      if (err) { throw err; }
    });
}
