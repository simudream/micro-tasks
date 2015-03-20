"use strict";
var MicroTaskQueue = MicroTaskQueue;

if (!MicroTaskQueue && require)
  MicroTaskQueue = require("../../../out/micro-task-queue");

describe("micro-task-queue", function() {

  it("ctor", function() {
    var queue = new MicroTaskQueue();
    expect(queue).toBeDefined();
    expect(queue.promise).toBeDefined();
    expect(queue.taskCount).toBe(0);
  });

  it("can run a single task", function(done) {
    var queue = new MicroTaskQueue(),
      taskWasCalled = false;

    queue.addTask(function() {
      taskWasCalled = true;
    });

    // run a macro task
    setTimeout(function() {
      expect(taskWasCalled).toBe(true);
      done();
    });
  });

  it("can run multiple tasks", function(done) {
    var queue = new MicroTaskQueue(),
      tasksCalled = 0;

    queue.addTasks([
      function() {
        tasksCalled++;
      },
      function() {
        tasksCalled++
      },
      function() {
        tasksCalled++
      }
    ]);

    // run a macro task
    setTimeout(function() {
      expect(tasksCalled).toBe(3);
      done();
    });
  });

  it("taskCount is accurate", function(done) {
    var queue = new MicroTaskQueue(),
      tasksCalled = 0;

    queue.addTasks([
      function() {
        tasksCalled++;
      },
      function() {
        tasksCalled++
      },
      function() {
        tasksCalled++
      }
    ]);

    expect(queue.taskCount).toBe(3);

    // run a macro task
    setTimeout(function() {
      expect(queue.taskCount).toBe(0);
      done();
    });
  });

  it("completed callback is called when tasks are present", function(done) {
    var doneWasCalled = false,
      taskWasCalled = false;

    var queue = new MicroTaskQueue(null, function() {
      doneWasCalled = true;
    });

    queue.addTask(function() {
      taskWasCalled = true;
    });

    // run a macro task
    setTimeout(function() {
      expect(taskWasCalled).toBe(true);
      expect(doneWasCalled).toBe(true);
      done();
    });
  });

  it("completed callback is not called when tasks are not present", function(done) {
    var doneWasCalled = false;
    var queue = new MicroTaskQueue(null, function() {
      doneWasCalled = true;
    });

    // run a macro task
    setTimeout(function() {
      expect(doneWasCalled).toBe(false);
      done();
    });
  });

  it("completed callback passes an error when an error has occurred in a task", function(done) {
    var queue = new MicroTaskQueue(null, function(result) {
      // caught error
      expect(result instanceof ReferenceError).toBe(true);
      done();
    });

    queue.addTask(function() {
      throw new ReferenceError();
    });
  });

  it("completed callback receives accumulated data", function(done) {
    var queue = new MicroTaskQueue(0);

    for (var i = 0; i < 100; i++) {
      queue.addTask(function(data) {
        return data + 1;
      });
    }

    queue.completed(function(data){
      expect(data).toBe(100);
      done();
    });

  });

});
