export default function (schema) {
  const resolvers = {}
  const queryFields = schema.getQueryType().getFields()
  const queryFieldsKeys = Object.keys(queryFields)

  queryFieldsKeys.forEach(key => {
    resolvers[key] = (obj, args = {}, context) => {
      return context.db({
        collection: key,
        action: 'find',
        args
      })
    }
  })

  return resolvers
}
