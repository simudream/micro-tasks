
<!-- TITLE/ -->

# Micro Tasking Library

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/pflannery/micro-tasks/master.svg)](http://travis-ci.org/pflannery/micro-tasks "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/micro-tasks.svg)](https://npmjs.org/package/micro-tasks "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/micro-tasks.svg)](https://npmjs.org/package/micro-tasks "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/pflannery/micro-tasks.svg)](https://david-dm.org/pflannery/micro-tasks)
[![Dev Dependency Status](https://img.shields.io/david/dev/pflannery/micro-tasks.svg)](https://david-dm.org/pflannery/micro-tasks#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/pflannery.svg)](https://www.gratipay.com/pflannery/ "Donate weekly to this project using Gratipay")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Simple task utility that runs tasks as micro tasks via promises.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('micro-tasks')`
- Install: `npm install --save micro-tasks`

### [Bower](http://bower.io/)
- Use: `require('micro-tasks')`
- Install: `bower install micro-tasks`

<!-- /INSTALL -->


## Documentation

[Library API](http://pflannery.github.io/micro-tasks/)

## Usage

####Single micro tasks
```js
  // creates a MicroTaskQueue, then passes in some optional data
  var data = 0;
    queue = new MicroTaskQueue(data);

  // the following functions are added in no specific order

  // adds a single micro task
  queue.addTask(function(data) {
    console.log("task " + data);
    return data + 1;
  })
  // optional done handler called when all tasks are complete
  .done(function(result) {
    if (result instanceof Error)
      console.error(result)
    else
      console.log("complete " + result);
  });

  queue.run(data);
```

####Multiple micro tasks
```js
  // creates a MicroTaskQueue, then passes in some optional data
  var data = 1,
    queue = new MicroTaskQueue();

  // adds a batch of micro tasks
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
  ])
  // optional done handler called when all tasks are complete
  .done(function(result) {
    if (result instanceof Error)
      console.error(result)
    else
      console.log("complete " + result);
  });

  queue.run(data);
```

####Monitoring single tasks
```js
// create a MonitoredTaskQueue, this example passes in some optional data
var data = 0;
var queue = new MonitoredTaskQueue();

// the following functions are added in no specific order

// optional beforeEach task handler
queue.beforeEach(function (data) {
  return data + 1;
})
// optional afterEach task handler
.afterEach(function (data) {
  return data + 1;
})
// adds a task with a taskDone callback handler
.addTask(function (data) {
  return data + 1;
}, function taskDone(data) {
  return data + 1;
})
// optional done handler called when all tasks are complete
.done(function (result) {
  if (result instanceof Error)
    console.error(result)
  else
    console.log("complete " + result);
});

queue.run(data);
```

####Monitoring task batches
```js
  var data = 0;
  // create a MonitoredTaskQueue, this example passes in some optional data
  var queue = new MonitoredTaskQueue();

  // the following functions are added in no specific order

  // optional beforeEach task handler
  queue.beforeEach(function (data) {
    return data + 1;
  })
  // optional afterEach task handler
  .afterEach(function (data) {
    return data + 1;
  })
  // adds a batch of tasks with a taskBatchDone callback handler
  // which is called once the batch of tasks are complete
  .addTasks([
    function (data) {
      return data + 1;
    },
    function (data) {
      return data + 1;
    },
    function (data) {
      return data + 1;
    }
  ], function taskBatchDone(data) {
    return data + 1;
  })
  // optional done handler called when all tasks are complete
  .done(function (result) {
    if (result instanceof Error)
      console.error(result)
    else
      console.log("complete " + result);
  });

  queue.run(data);
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

- [pflannery](https://github.com/pflannery) — [view contributions](https://github.com/pflannery/micro-tasks/commits?author=pflannery)

[Become a contributor!](https://github.com/pflannery/micro-tasks/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Licensed under GNU GPL v3

Copyright &copy; 2015+ pflannery (https://github.com/pflannery)

<!-- /LICENSE -->


[![Analytics](https://ga-beacon.appspot.com/UA-47157500-1/micro-task-queue/readme)](https://github.com/pflannery/micro-task-queue)
