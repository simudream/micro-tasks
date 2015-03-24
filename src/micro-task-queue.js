/**
 * @module MicroTasking
 */
"use strict";

function wrapMicroTask(queue, taskHandler) {
  return function(data) {
    var result, handlerThrew = 1;

    try {
      result = taskHandler(data);
      handlerThrew = 0
    } finally {
      if (handlerThrew == 1)
        queue.promise.catch(queue.doneHandler);
    }

    queue.taskCount--;
    if (queue.taskCount === 0 && queue.doneHandler) {
      queue.promise.then(queue.doneHandler);
    }

    return result;
  }
}

/**
 * Class for creating tasks that are run as micro tasks using Promises.
 *
 * @class MicroTaskQueue
 *
 * @constructor
 * @param data Custom data that will be passed to the first task
 * @param {Function} doneHandler
 *      called when all tasks have been completed
 */
function MicroTaskQueue(doneHandler) {
  this.taskCount = 0;
  if (doneHandler)
    this.done(doneHandler);

  var this_ = this;
  this.promise = new Promise(function(resolve) {
    /**
     * Runs all queued tasks
     *
     * @method run
     * @param {Variable} data
      */
    this_.run = resolve;
  });
}

MicroTaskQueue.prototype = {
  /**
   * Adds a task function to the queue which will be called during the next micro task cycle
   *
   * @method addTask
   * @async
   *
   * @param {Function} taskHandler The task to be called
   *     Note: data returned in this function will be passed to the next task
   * @return current {MicroTaskQueue} instance
   *
   * @example
   *
   * ```javascript
   *  var data = 1;
   *  var queue = new MicroTaskQueue(data);
   *
   *  queue.addTask(function(data){
   *    console.log("task " + data);
   *    return data + 1;
   *  }).addTask(function(data){
   *    console.log("task " + data);
   *    return data + 1;
   *  });
   * ```
   */
  addTask: function(taskHandler) {
    this.promise = this.promise.then(wrapMicroTask(this, taskHandler));
    this.taskCount++;
    return this;
  },

  /**
   * Adds an array of task functions to the queue which wi;; be called during the next micro task cycle
   *
   * @method addTask
   * @async
   *
   * @param {Array} taskBatchHandlers An array of task functions to be called
   *     Note: data returned per function will be passed to the next task
   * @return current {MicroTaskQueue} instance
   *
   * @example
   *
   * ```javascript
   *  var data = 1;
   *  var queue = new MicroTaskQueue(data);
   *
   *  queue.addTask([
   *    function(data){
   *      console.log("task " + data);
   *      return data + 1;
   *    },
   *    function(data){
   *      console.log("task " + data);
   *      return data + 1;
   *    },
   *    function(data){
   *      console.log("task " + data);
   *      return data + 1;
   *    }
   *  ]);
   * ```
   */
  addTasks: function(taskBatchHandlers) {
    var index = 0, count = taskBatchHandlers.length;
    for (; index < count; index++)
      this.promise = this.promise.then(wrapMicroTask(this, taskBatchHandlers[index]));

    this.taskCount += count;
    return this;
  },

  /**
   * An event that is called when all tasks have been done
   *
   * @method done
   * @param {Function} doneHandler
   *    @param result An Error if an error occurred during a task otherwise its any data that was passed from the last task ran
   */
  done: function(doneHandler) {
    this.doneHandler = doneHandler;
  }

};