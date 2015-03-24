"use strict";
var MicroTaskQueue = MicroTaskQueue,
  MicroTaskBreak = MicroTaskBreak;
var chai = chai, expect = expect;

if (!MicroTaskQueue && require) {
	chai = require("chai");
	expect = chai.expect;
  MicroTaskBreak = require("../../../out/micro-task-queue").MicroTaskBreak;
  MicroTaskQueue = require("../../../out/micro-task-queue").MicroTaskQueue;
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

    // run the tasks
    queue.run();

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

    // run the tasks
    queue.run();

    // run a macro task
    setTimeout(function() {
      expect(tasksCalled).to.equal(3);
      done();
    });
  });

  it("can break during task execution", function(done) {
    var queue = new MicroTaskQueue(),
      tasksCalled = 0,
      doneCalled = false;

    queue.addTasks([
      function() {
        tasksCalled++;
      },
      function() {
        tasksCalled++;
        queue.break("test reason");
      },
      function() {
        tasksCalled++
      }
    ]).done(function(breakExp){
      expect(breakExp instanceof MicroTaskBreak).to.be.equal(true);
      expect(breakExp.reason).to.be.equal("test reason");
      doneCalled = true;
    });

    // run the tasks
    queue.run();

    // run a macro task
    setTimeout(function() {
      expect(tasksCalled).to.equal(2);
      expect(doneCalled).to.equal(true);
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

    // run the tasks
    queue.run();

    // run a macro task
    setTimeout(function() {
      expect(queue.taskCount).to.equal(0);
      done();
    });
  });

  it("done handler is called when tasks are present", function(done) {
    var doneWasCalled = false,
      taskWasCalled = false;

    var queue = new MicroTaskQueue(function() {
      doneWasCalled = true;
    });

    queue.addTask(function() {
      taskWasCalled = true;
    });

    // run the tasks
    queue.run();

    // run a macro task
    setTimeout(function() {
      expect(taskWasCalled).to.equal(true);
      expect(doneWasCalled).to.equal(true);
      done();
    });
  });

  it("done handler is not called when tasks are not present", function(done) {
    var doneWasCalled = false;
    var queue = new MicroTaskQueue(function() {
      doneWasCalled = true;
    });

    // run the tasks
    queue.run();

    // run a macro task
    setTimeout(function() {
      expect(doneWasCalled).to.equal(false);
      done();
    });
  });

  it("done handler passes an error when an error has occurred in a task", function(done) {
    var queue = new MicroTaskQueue(function(result) {
      // caught error
      expect(result instanceof ReferenceError).to.equal(true);
      done();
    });

    // run the tasks
    queue.run();

    queue.addTask(function() {
      throw new ReferenceError();
    });
  });

  it("done handler receives accumulated data", function(done) {
    var queue = new MicroTaskQueue();

    for (var i = 0; i < 100; i++) {
      queue.addTask(function(data) {
        return data + 1;
      });
    }

    // run the tasks
    queue.run(0);

    queue.done(function(data){
      expect(data).to.equal(100);
      done();
    });

  });

});
