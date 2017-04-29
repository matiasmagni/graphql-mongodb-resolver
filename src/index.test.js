/* eslint-env jest */
import { buildSchema, graphql } from 'graphql'
import resolver from './index'

const schemaString = `
  type Message {
    id: ID!
    content: String
    author: Author
  }
  
  type Author {
    id: ID!
    name: String 
  }

  type Query {
    message: [Message]
    author: [Author]
  }

  type Mutation {
    createMessage(content: String, author: String): Message
    updateMessage(id: ID!, content: String, author: String): Message
  }
`

describe('resolver()', () => {
  let db, root, schema, results

  beforeEach(() => {
    results = [
      {field1: 'a', field2: 'b'},
      {field1: 'c', field2: 'd'}
    ]
    schema = buildSchema(schemaString)
    db = jest.fn().mockReturnValue(Promise.resolve(results))
    root = resolver(schema)
  })

  describe('queries', () => {
    it('should return simple data without any relations', () => {
      return root.author({}, { db }).then(response => {
        expect(db).toHaveBeenCalledWith({
          collection: 'author',
          action: 'find',
          args: {}
        })
        expect(response).toEqual(results)
      })
    })

    it('should return simple data without any relations with graphql', () => {
      db = jest.fn().mockReturnValue(Promise.resolve([
        { name: 'test' }
      ]))
      return graphql(schema, '{ author { name } }', root, { db }).then(response => {
        expect(db).toHaveBeenCalledWith({
          collection: 'author',
          action: 'find',
          args: {}
        })
        expect(response).toEqual({ data: { author: [ { name: 'test' } ] } })
      })
    })
  })

  describe('mutations', () => {

  })
})
