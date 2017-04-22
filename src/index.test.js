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

  describe('resolvers object', () => {
    it('should have 1 resolver', () => {
      expect(Object.keys(resolvers)).toEqual(['message'])
    })
  })

  describe('queries', () => {
    describe('without params', () => {
      it('should return a promise', () => {
        expect(resolvers.message().then).toBeInstanceOf(Function)
      })

      it('should be able to return results', (done) => {
        resolvers.message().then(results => {
          expect(results).toEqual(['query', 'results'])
          done()
        })
      })

      it('should call mongodb api', () => {
        expect(db.collection).toHaveBeenCalledWith('message')
        expect(collectionApi.find).toHaveBeenCalledWith({})
      })
    })
  })

  describe('mutations', () => {

  })
})
