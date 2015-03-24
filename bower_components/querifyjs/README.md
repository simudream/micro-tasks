# Querify JS

[![Build Status](https://secure.travis-ci.org/pflannery/querifyjs.png?branch=master)](http://travis-ci.org/pflannery/querifyjs "Check this project's build status on TravisCI")
[![NPM version](https://badge.fury.io/js/querifyjs.png)](https://npmjs.org/package/querifyjs "View this project on NPM")
[![Gittip donate button](http://img.shields.io/gittip/pflannery.png)](https://www.gittip.com/pflannery/ "Donate weekly to this project using Gittip")
[![Analytics](https://ga-beacon.appspot.com/UA-47157500-1/querifyjs/readme)](https://github.com/pflannery/querifyjs)

A No-SQL object query library made for javascript

## Documentation

[Library API](http://pflannery.github.io/querifyjs/)

## Basic Examples
```js
   var models = [
       {name: 'apple'},
       {name: 'banana'},
       {name: 'pineapple'},
       {name: 'strawberry'},
       {name: 'orange'},
       {name: 'grapefruit'}
   ];
   var query = {
       name: /apple/,      // regexp to match any names with 'apple' in them
       $or: {              // or
           name: 'banana'  // match name against 'banana'
       }
   };
```

```js
   var results = querify.sync.filter(models, query);
   // produces [{"name":"apple"},{"name":"banana"},{"name":"pineapple"}]
   var query = {
       name: {
           $right: 'e'     // match the last char in name that contains 'e'
       }
   };
   var results = querify.sync.filter(models, query);
   // produces [{"name":"apple"},{"name":"pineapple"},{"name":"orange"}]
```

```js
   // promise based example
   var query = {
       name: /an/          // regexp to match any names with 'an'
   };
   querify.promise.filter(models, query)
           .then(function(results) {
               // produces [{"name":"banana"},{"name":"orange"}]
           });
```

## Contributing
Feel free to submit ideas and issues.
