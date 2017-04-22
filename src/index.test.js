/* eslint-env jest */
import { buildSchema } from 'graphql'
import resolve from './index'

const schemaString = `
  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    message(id: ID!): Message
  }

  type Mutation {
    createMessage(content: String, author: String): Message
    updateMessage(id: ID!, content: String, author: String): Message
  }
`

describe('resolve()', () => {
  let schema, db, resolvers, collectionApi, findApi

  beforeEach(() => {
    findApi = {
      toArray (callback) {
        callback(null, ['query', 'results'])
      }
    }

    collectionApi = {
      find: jest.fn().mockReturnValue(findApi),
      insertOne: jest.fn(),
      updateMany: jest.fn()
    }

    db = {
      collection: jest.fn().mockReturnValue(collectionApi)
    }

    schema = buildSchema(schemaString)
    resolvers = resolve(schema, db)
  })

  describe('queries resolver', () => {
    it('should return a promise', () => {
      expect(resolvers.message().then).toBeInstanceOf(Function)
    })

    it('should call mongodb api', (done) => {
      resolvers.message().then(results => {
        expect(results).toEqual(['query', 'results'])
        expect(db.collection).toHaveBeenCalledWith('message')
        expect(collectionApi.find).toHaveBeenCalledWith({})
        done()
      })
    })

    it('should call mongodb api with params', (done) => {
      resolvers.message({author: 'Pawel'}).then(results => {
        expect(results).toEqual(['query', 'results'])
        expect(db.collection).toHaveBeenCalledWith('message')
        expect(collectionApi.find).toHaveBeenCalledWith({author: 'Pawel'})
        done()
      })
    })
  })

  describe('mutations', () => {

  })
})
