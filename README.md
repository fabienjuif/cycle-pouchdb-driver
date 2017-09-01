# cycle-pouchdb-driver
>  A Cycle.js Driver for using PouchDB database

[![CircleCI](https://circleci.com/gh/fabienjuif/cycle-pouchdb-driver.svg?style=shield)](https://circleci.com/gh/fabienjuif/cycle-pouchdb-driver) [![Coverage Status](https://coveralls.io/repos/github/fabienjuif/cycle-pouchdb-driver/badge.svg?branch=master)](https://coveralls.io/github/fabienjuif/cycle-pouchdb-driver?branch=master) [![NPM Version](https://badge.fury.io/js/cycle-pouchdb-driver.svg)](https://www.npmjs.com/package/cycle-pouchdb-driver)
[![Size](http://img.badgesize.io/fabienjuif/cycle-pouchdb-driver/master/index.js.svg)]()

## API
### create
```es6
const { makePouchDBDriver } = require('cycle-pouchdb-driver')

const drivers = {
  httpServer: makeHttpServerDriver(),
  pouchDB: makePouchDBDriver({
    // <databaseName>: name
  }),
}
```

### events to send
```es6
{ database, action, ...rest }
```
- **database:** database name, [see official documentation](https://pouchdb.com/api.html#create_database)
- **action:**
  - [get](https://pouchdb.com/api.html#fetch_document)
  - [put](https://pouchdb.com/api.html#create_document)
  - [allDocs](https://pouchdb.com/api.html#batch_fetch)
- **...rest:** look at action doc, exemple `get` can take `_id` and `options`

### events to read
```es6
{ database, action, data: [] }
```
- **database** database source event, so you can filter
- **action** action source event, so you can filter
- **data** results, can be PouchDB errors
