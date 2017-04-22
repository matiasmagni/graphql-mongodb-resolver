export default function (schema, db) {
  const resolvers = {}
  const queryFields = schema.getQueryType().getFields()
  const queryFieldsKeys = Object.keys(queryFields)

  queryFieldsKeys.forEach(key => {
    resolvers[key] = (args) => {
      return new Promise((resolve, reject) => {
        db.collection(key).find(args).toArray((error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        })
      })
    }
  })

  return resolvers
}
