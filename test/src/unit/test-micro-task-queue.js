"use strict";
var MicroTaskQueue = MicroTaskQueue;
var chai = chai, expect = expect;

if (!MicroTaskQueue && require) {
	chai = require("chai");
	expect = chai.expect;
	MicroTaskQueue = require("../../../out/micro-task-queue");
}

describe("micro-task-queue", function() {

  it("ctor", function() {
    var queue = new MicroTaskQueue();
    expect(queue).to.be.defined;
    expect(queue.promise).to.defined;
    expect(queue.taskCount).to.equal(0);
  });

  it("can run a single task", function(done) {
    var queue = new MicroTaskQueue(),
      taskWasCalled = false;

    queue.addTask(function() {
      taskWasCalled = true;
    });

    // run a macro task
    setTimeout(function() {
      expect(taskWasCalled).to.equal(true);
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
      expect(tasksCalled).to.equal(3);
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

    expect(queue.taskCount).to.equal(3);

    // run a macro task
    setTimeout(function() {
      expect(queue.taskCount).to.equal(0);
      done();
    });
  });

  it("done callback is called when tasks are present", function(done) {
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
      expect(taskWasCalled).to.equal(true);
      expect(doneWasCalled).to.equal(true);
      done();
    });
  });

  it("done callback is not called when tasks are not present", function(done) {
    var doneWasCalled = false;
    var queue = new MicroTaskQueue(null, function() {
      doneWasCalled = true;
    });

    // run a macro task
    setTimeout(function() {
      expect(doneWasCalled).to.equal(false);
      done();
    });
  });

  it("done callback passes an error when an error has occurred in a task", function(done) {
    var queue = new MicroTaskQueue(null, function(result) {
      // caught error
      expect(result instanceof ReferenceError).to.equal(true);
      done();
    });

    queue.addTask(function() {
      throw new ReferenceError();
    });
  });

  it("done callback receives accumulated data", function(done) {
    var queue = new MicroTaskQueue(0);

    for (var i = 0; i < 100; i++) {
      queue.addTask(function(data) {
        return data + 1;
      });
    }

    queue.done(function(data){
      expect(data).to.equal(100);
      done();
    });

  });

});
