(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('xstream'), require('pouchdb')) :
	typeof define === 'function' && define.amd ? define(['exports', 'xstream', 'pouchdb'], factory) :
	(factory((global['cycle-pouchdb-driver'] = global['cycle-pouchdb-driver'] || {}),global.xs,global.PouchDB));
}(this, (function (exports,xs,PouchDB) { 'use strict';

xs = xs && 'default' in xs ? xs['default'] : xs;
PouchDB = PouchDB && 'default' in PouchDB ? PouchDB['default'] : PouchDB;

var getPouchDBParams = (function (action) {
  switch (action) {
    case 'get':
      return ['_id', 'options'];
    case 'put':
      return ['doc', 'options'];
    case 'allDocs':
      return ['options'];
    default:
      throw new Error('<POUCHDB CYCLE DRIVER> ' + action + ' is not a know action', event);
  }
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var callPouchDB = (function (database, event) {
  var args = getPouchDBParams(event.action).map(function (name) {
    return event[name];
  }).filter(function (arg) {
    return !!arg;
  });

  return database[event.action].apply(database, _toConsumableArray(args));
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var make = (function (options) {
  if (options === undefined) throw new Error('<POUCHDB CYCLE DRIVER> options are mandatory');

  // init databases
  var databases = Object.keys(options).map(function (key) {
    return _defineProperty({}, key, new PouchDB(options[key]));
  }).reduce(function (prev, curr) {
    return _extends({}, prev, curr);
  }, {});

  return function (sink$) {
    // function to send event to cycle
    var listener = void 0;

    // new event
    var next = function next(event) {
      var name = event.database,
          action = event.action;

      var database = databases[name];

      // controls
      if (database === undefined) throw new Error('<POUCHDB CYCLE DRIVER> ' + name + ' database is not provided in options', event);

      // call pouchDB and send result to cycle app
      callPouchDB(database, event).then(function (data) {
        listener.next({ database: name, action: action, data: data });
      }, function (data) {
        listener.next({ database: name, action: action, data: data });
      });
    };

    // cycle driver connexion
    sink$.addListener({ next: next });
    return xs.create({
      start: function start(eventListener) {
        listener = eventListener;
      },
      stop: function stop() {}
    });
  };
});

exports.makePouchDBDriver = make;

Object.defineProperty(exports, '__esModule', { value: true });

})));
