//
// base
// A simple yet reasonable and useful inheritance system for JavaScript.
// https://github.com/samsonjs/base
//
// Copyright 2013 Sami Samhuri <sami@samhuri.net>
// MIT License
// http://sjs.mit-license.org
//

//
// Declare a base object called `Base`. It will get 2 methods and its
// prototype will get 4 methods. That's the entire system.
//
var Base = Object.create(Object.prototype, {
  name: {
    value: 'Base',
    enumerable: true
  },
  prototype: {
    value: {},
    enumerable: false,
    writable: false,
    configurable: false
  }
});

// Ship it if we're running in Node (or another CommonJS module system).
if (typeof module.exports !== 'undefined') {
  module.exports = Base;
}

//
// To create a new class-ish object you use `Base.extend(name)`, e.g.
//
//   var Person = Base.extend('Person');
//
// Inheritance is set up from `Person` to `Base` as well as from `Person.prototype`
// to `Base.prototype`. This makes it easy to extend Person if you want:
//
//   var Canadian = Person.extend('Canadian');
//
Base.extend = function(name) {
  // Inherit Base methods with Object.create(this, ...)
  return Object.create(this, {

    // Attach the given name
    name: {
      value: name || '<anonymous>',
      enumerable: true
    },

    // Set up a link to the super object.
    _super: {
      value: this
    },

    // Set up the prototype chain.
    prototype: {
      value: Object.create(this.prototype),
      enumerable: true,
      writable: true,
      configurable: true
    }
  });
};

//
// This inheritance system doesn't use the `new` keyword. Instead each base object
// has a `create` method that accepts an optional object of fields for the new
// object.
//
//   var p = Person.create({ name: 'samsonjs' });
//   p.name == 'samsonjs' // => true
//
Base.create = function(/* ... */) {
  var obj = Object.create(this.prototype, {
    base: {
      value: this,
      enumerable: false,
      writable: false,
      configurable: false
    },
    constructor: {
      value: this.create.bind(this),
      enumerable: false,
      writable: false,
      configurable: false
    }
  });
  obj.init.apply(obj, Array.prototype.slice.call(arguments));
  return obj;
};

//
// If you want a prototype method to call a parent object's method you can call it
// directly, just like you normally would in JS:
//
//   Canadian.prototype.speak = function(words) {
//     Person.prototype.speak.call(this, words.split(' ').join(' eh '));
//   };
//
// Or you can use `this.callSuper(method, ...)` like so:
//
//   Canadian.prototype.speak = function(words) {
//     this.callSuper('speak', words.split(' ').join(' eh '));
//   };
//
Base.prototype.callSuper = function(method /*, ... */) {
  var base = this.base;
  if (!base._super) {
    throw new Error(base.name + '._super not found');
  }
  var superFn = base._super.prototype && base._super.prototype[method];
  if (typeof superFn != 'function') {
    throw new Error(base.name + '._super.prototype.' + method + ' not found or not a function');
  }
  var args = Array.prototype.slice.call(arguments, 1);
  return superFn.apply(this, args);
};

//
// That's it for the base object methods. Next up are the prototype methods.
//
// First we'll create a method like `instanceof` that walks up the prototype chain
// checking if this object inherits from a given super-object.
//
Base.prototype.like = function(sup) {
  var x = this;
  while (x && Object.getPrototypeOf(x)) {
    if (sup.prototype.isPrototypeOf(x)) {
      return true;
    }
    x = Object.getPrototypeOf(x);
  }
  return false;
};

//
// Objects get a `mixin` method that merges the properties from the given
// argument into themselves.
//
Base.prototype.mixin = function(fields) {
  if (fields.length == 0) return;
  var keys = Object.keys(fields),
      i = keys.length;
  while (i--) {
    this[keys[i]] = fields[keys[i]];
  }
};

//
// Like many other JavaScript inheritance systems, an `init` method is available
// and called by when you call `create`. You can override it.
//
//   Canadian.prototype.init = function(fields) {
//     if (fields) {
//       fields.nationality = 'Canadian';
//     }
//     Canadian.callSuper('init', this, fields);
//   };
//
// The default `init` method uses `mixin` to initialize properties from the
// optional argument.
//
//   var c = Canadian.create({ name: 'samsonjs' });
//   c.name == 'samsonjs'; // => true
//

Base.prototype.init = function(fields) {
  if (fields) {
    this.mixin(fields);
  }
};
