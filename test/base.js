
var logger = require("log4js").getLogger();
var yelp = require('../util/yelp');
var should = require('should');
var app = require('../server').app;
var request = require('supertest')
var port = 3000;

describe('GET /', function() {
  it('GET / should return 200', testGetBaseStatusCode);
  it('GET / should return basic OK text in body', testGetBaseBody);
});

function testGetBaseStatusCode() {
  request(app)
    .get('/')
    .expect(202);
}

function testGetBaseBody() {
  request(app)
    .get('/')
    .expect('A-OKf');
}
