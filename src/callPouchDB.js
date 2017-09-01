import getPouchDBParams from './getPouchDBParams'

export default (database, event) => {
  const args = getPouchDBParams(event.action)
    .map(name => event[name])
    .filter(arg => !!arg)

  return database[event.action](...args)
}
