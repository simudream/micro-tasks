"use strict";
var MonitoredTaskQueue = MonitoredTaskQueue;
var chai = chai, expect = expect;

if (!MonitoredTaskQueue && require) {
  chai = require("chai");
  expect = chai.expect;
  MonitoredTaskQueue = require("../../../out/micro-task-queue").MonitoredTaskQueue;
}

describe("monitored-task-queue", function () {

  it("ctor", function () {
    var queue = new MonitoredTaskQueue();
    expect(queue).to.be.defined;
    expect(queue.promise).to.defined;
    expect(queue.taskCount).to.equal(0);
  });

  it("beforeEach, taskDone, and AfterEach handlers are called when running a single task", function (done) {
    var queue = new MonitoredTaskQueue(),
      order = [];

    queue.beforeEach(function (data) {
      order.push("beforeEach");
      return data + 1;
    })
      .afterEach(function (data) {
        order.push("afterEach");
        return data + 1;
      })
      .addTask(function (data) {
        order.push("task");
        return data + 1;
      }, function taskDone(data) {
        order.push("taskDone");
        return data + 1;
      })
      .done(function (result) {
        expect(result).to.equal(4);
        expect(order[0]).to.equal("beforeEach");
        expect(order[1]).to.equal("task");
        expect(order[2]).to.equal("taskDone");
        expect(order[3]).to.equal("afterEach");
        done();
      });

    // run the tasks
    queue.run(0);

  });

  it("beforeEach, taskDone, and AfterEach handlers is called when running multiple tasks", function (done) {
    var queue = new MonitoredTaskQueue(),
      order = [];

    queue.beforeEach(function (data) {
      order.push("beforeEach");
      return data + 1;
    })
      .afterEach(function (data) {
        order.push("afterEach");
        return data + 1;
      })
      .addTasks([
        function (data) {
          order.push("task");
          return data + 1;
        },
        function (data) {
          order.push("task");
          return data + 1;
        },
        function (data) {
          order.push("task");
          return data + 1;
        }
      ], function taskBatchDone(data) {
        order.push("taskBatchDone");
        return data + 1;
      })
      .done(function (result) {
        expect(result).to.equal(10);

        expect(order[0]).to.equal("beforeEach");
        expect(order[1]).to.equal("task");
        expect(order[2]).to.equal("afterEach");

        expect(order[3]).to.equal("beforeEach");
        expect(order[4]).to.equal("task");
        expect(order[5]).to.equal("afterEach");

        expect(order[6]).to.equal("beforeEach");
        expect(order[7]).to.equal("task");
        expect(order[8]).to.equal("afterEach");

        expect(order[9]).to.equal("taskBatchDone");

        done();
      });

    // run the tasks
    queue.run(0);

  });

  it("afterEach handler is called when tasks are present", function (done) {
    var queue = new MonitoredTaskQueue(),
      afterEachCalled = 0;

    queue.afterEach(function () {
      afterEachCalled++;
    });

    queue.addTasks([
      function () {
        //tasksCalled++;
      },
      function () {
        //tasksCalled++
      },
      function () {
        //tasksCalled++
      }
    ]);

    // run the tasks
    queue.run();

    // run a macro task
    setTimeout(function () {
      expect(afterEachCalled).to.equal(3);
      done();
    });
  });

});
