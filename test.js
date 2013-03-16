#!/usr/bin/env node

var assert = require('assert');

var Base = require('./base.js');
assert(Object.prototype.isPrototypeOf(Base), 'Base inherits from Object');
assert.equal('Base', Base.name);
assert.equal('function', typeof Base.extend);
assert.equal('function', typeof Base.create);
assert.equal('function', typeof Base.prototype.callSuper);
assert.equal('function', typeof Base.prototype.like);
assert.equal('function', typeof Base.prototype.mixin);
assert.equal('function', typeof Base.prototype.init);

var Person = Base.extend('Person');
assert(Base.isPrototypeOf(Person), 'Person inherits from Base');
assert.equal('Person', Person.name);
assert(Base.prototype.isPrototypeOf(Person.prototype), 'Person proto inherits from Base proto');
assert.equal('function', typeof Person.extend);
assert.equal('function', typeof Person.create);
assert.equal('function', typeof Person.prototype.callSuper);
assert.equal('function', typeof Person.prototype.like);
assert.equal('function', typeof Person.prototype.mixin);
assert.equal('function', typeof Person.prototype.init);

var p = Person.create({ name: 'samsonjs' });
assert(p.like(Person), 'p inherits from Person');
assert(p.like(Base), 'p inherits from Base');
assert(p.like(Object), 'p inhertis from Object');
assert.equal('samsonjs', p.name, 'p has the correct "name" property');

Person.prototype.foo = function(x) { return x; };
var Canadian = Person.extend('Canadian');
Canadian.prototype.foo = function(x) {
  return this.callSuper('foo', x);
};
assert.equal(42, Canadian.create().foo(42));

console.log('ok');
