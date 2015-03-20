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
        queue.promise.catch(queue.completedHandler);
    }

    queue.taskCount--;
    if (queue.taskCount === 0 && queue.completedHandler) {
      queue.promise.then(queue.completedHandler);
    }

    return result;
  }
}

/**
 * Class for creating synchronous Query instances.
 *
 * @class MicroTaskQueue
 *
 * @constructor
 * @param data Custom data that will be passed to the first task
 * @param {Function} completedHandler
 *      call when all tasks have been completed
 */
function MicroTaskQueue(data, completedHandler) {
  this.taskCount = 0;
  if (completedHandler)
    this.completed(completedHandler);
  this.promise = Promise.resolve(data);
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
   * @param {Array} taskHandlers An array of task functions to be called
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
  addTasks: function(taskHandlers) {
    var index = 0, count = taskHandlers.length;
    for (; index < count; index++)
      this.promise = this.promise.then(wrapMicroTask(this, taskHandlers[index]));

    this.taskCount += count;
    return this;
  },

  /**
   * An event that is called when all tasks have been completed
   *
   * @method completed
   * @param {Function} completedHandler
   *    @param result An Error if an error occurred during a task otherwise its any data that was passed from the last task ran
   */
  completed: function(completedHandler) {
    this.completedHandler = completedHandler;
  }

};

/* export the library */
if (typeof module !== typeof undefined && typeof module.exports !== typeof undefined) {
  /* node */
  module.exports = MicroTaskQueue;
} else {
  var indirectEval = (0, eval),
    globalThis = indirectEval('this');

  globalThis.MicroTaskQueue = MicroTaskQueue;
}
