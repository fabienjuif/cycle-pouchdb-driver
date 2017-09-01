import xs from 'xstream'
import PouchDB from 'pouchdb'
import callPouchDB from './callPouchDB'

export default (options) => {
  if (options === undefined) throw new Error('<POUCHDB CYCLE DRIVER> options are mandatory')

  // init databases
  const databases = Object
    .keys(options)
    .map(key => ({ [key]: new PouchDB(options[key]) }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})

  return (sink$) => {
    // function to send event to cycle
    let listener

    // new event
    const next = (event) => {
      const { database: name, action } = event
      const database = databases[name]

      // controls
      if (database === undefined) throw new Error(`<POUCHDB CYCLE DRIVER> ${name} database is not provided in options`, event)

      // call pouchDB and send result to cycle app
      callPouchDB(database, event).then(
        (data) => { listener.next({ database: name, action, data }) },
        (data) => { listener.next({ database: name, action, data }) },
      )
    }

    // cycle driver connexion
    sink$.addListener({ next })
    return xs.create({
      start: (eventListener) => {
        listener = eventListener
      },
      stop: () => {},
    })
  }
}
