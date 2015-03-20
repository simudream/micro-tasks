
<!-- TITLE/ -->

# Micro Task Queue

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/pflannery/micro-task-queue/master.svg)](http://travis-ci.org/pflannery/micro-task-queue "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/micro-task-queue.svg)](https://npmjs.org/package/micro-task-queue "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/micro-task-queue.svg)](https://npmjs.org/package/micro-task-queue "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/pflannery/micro-task-queue.svg)](https://david-dm.org/pflannery/micro-task-queue)
[![Dev Dependency Status](https://img.shields.io/david/dev/pflannery/micro-task-queue.svg)](https://david-dm.org/pflannery/micro-task-queue#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/pflannery.svg)](https://www.gratipay.com/pflannery/ "Donate weekly to this project using Gratipay")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Simple task utility that runs tasks as micro tasks via promises.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('micro-task-queue')`
- Install: `npm install --save micro-task-queue`

### [Bower](http://bower.io/)
- Use: `require('micro-task-queue')`
- Install: `bower install micro-task-queue`

<!-- /INSTALL -->


## Documentation

[Library API](http://pflannery.github.io/micro-query-tasks/)

## Usage

```js
  var data = 1;
  var queue = new MicroTaskQueue(data);
  queue.addTasks([
    function(data) {
      console.log("task " + data);
      return data + 1;
    },
    function(data) {
      console.log("task " + data);
      return data + 1;
    },
    function(data) {
      console.log("task " + data);
      return data + 1;
    }
  ]).completed(function(result) {
    if (result instanceof Error)
      console.error(result)
    else
      console.log("complete " + result);
  });
```

<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- pflannery (https://github.com/pflannery)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/pflannery.svg)](https://www.gratipay.com/pflannery/ "Donate weekly to this project using Gratipay")

### Contributors

These amazing people have contributed code to this project:

- [pflannery](https://github.com/pflannery) — [view contributions](https://github.com/pflannery/micro-task-queue/commits?author=pflannery)

[Become a contributor!](https://github.com/pflannery/micro-task-queue/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under GNU GPL v3

Copyright &copy; 2015+ pflannery (https://github.com/pflannery)

<!-- /LICENSE -->


[![Analytics](https://ga-beacon.appspot.com/UA-47157500-1/querifyjs/readme)](https://github.com/pflannery/querifyjs)