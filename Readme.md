
# Base

A simple yet reasonable and useful inheritance system for JavaScript.

The [implementation](/base.js) is just a few dozen lines of code and it is
well commented. Refer to the code for documentation.

Here is some example code illustrating the use of this system in Node:

    var Base = require('path/to/base');

    // Use `extend` for inheritance.
    var Person = Base.extend('Person');
    console.log(Person.name)       // => Person

    // Inherit from other base objects.
    var Canadian = Person.extend('Canadian');

    // There are `init` methods.
    Canadian.prototype.init = function(fields) {
      fields = fields || {};
      fields.nationality = 'Canadian';

      // Calls `Person.init` on `this`
      // (short for Person.prototype.init.call(this, fields))
      this.callSuper('init', fields);
    };

    // Instantiate objects with `create`
    var p = Canadian.create({ name: 'samsonjs' });

    // `init` calls `this.mixin(fields)` by default
    // (mixin does exactly what you think it does)
    console.log(p.name);           // => samsonjs
    console.log(p.nationality);    // => Canadian

    // You can check if an object inhertits from any base object.
    console.log(p.like(Canadian)); // => true
    console.log(p.like(Person));   // => true
    console.log(p.like(Base));     // => true
    console.log(p.like(Object));   // => true

    var American = Person.extend('American');
    console.log(p.like(American)); // => false


# License

Copyright 2013 Sami Samhuri <sami@samhuri.net>

[MIT License](http://sjs.mit-license.org)
