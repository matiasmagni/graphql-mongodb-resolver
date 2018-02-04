module.exports = function (schema) {
  const resolvers = {}
  const queryFields = schema.getQueryType().getFields()
  const queryFieldsKeys = Object.keys(queryFields)

  queryFieldsKeys.forEach(key => {
    resolvers[key] = (args = {}, context) => {
      return context.db({
        collection: key,
        action: 'find',
        args
      })
    }
  })

  return resolvers
}
