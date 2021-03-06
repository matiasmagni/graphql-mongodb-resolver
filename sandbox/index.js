require('babel-register')
var express = require('express');
var assert = require('assert')
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var resolver = require('../src/index').default
var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017/myproject';

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log('Connected successfully to mongodb server');
  var app = express();
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolver(schema, db),
    graphiql: true,
  }));
  app.listen(4000, () => {
    console.log('Now browse to localhost:4000/graphql')
  });
  process.on('SIGINT', () => {
    console.log('Closing connection to mongodb server')
    db.close();
  })
});
