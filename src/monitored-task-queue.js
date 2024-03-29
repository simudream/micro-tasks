"use strict";

/**
 * Class that provides beforeEach, afterEach, taskDone and taskBatchDone handlers to assist
 * with scenarios like monitoring progress of micro tasks.
 *
 * @class MonitoredTaskQueue
 *
 * @constructor
 * @param {Function} doneHandler
 *      called when all tasks have been completed
 */
function MonitoredTaskQueue(doneHandler) {
  MicroTaskQueue.call(this, doneHandler);
}

MonitoredTaskQueue.prototype = {

  superAddTask: MicroTaskQueue.prototype.addTask,

  done: MicroTaskQueue.prototype.done,

  addTask: function (taskHandler, taskDoneHandler) {
    if (this.beforeEachHandler)
      this.superAddTask(this.beforeEachHandler);

    this.superAddTask(taskHandler);

    if (taskDoneHandler)
      this.superAddTask(taskDoneHandler);

    if (this.afterEachHandler)
      this.superAddTask(this.afterEachHandler);

    return this;
  },

  addTasks: function (taskBatchHandlers, taskBatchDoneHandler) {
    var index = 0, count = taskBatchHandlers.length;
    for (; index < count; index++)
      this.addTask(taskBatchHandlers[index]);

    if (taskBatchDoneHandler)
      this.superAddTask(taskBatchDoneHandler);
    
    return this;
  },

  /**
   * @method beforeEach
   * @async
   *
   * @param {Function} beforeEachHandler The method to be called before running a task
   * @return current {MicroTaskQueue} instance
   */
  beforeEach: function (beforeEachHandler) {
    this.beforeEachHandler = beforeEachHandler;
    return this;
  },

  /**
   * @method afterEach
   * @async
   *
   * @param {Function} afterEachHandler The method to be called before running a task
   * @return current {MicroTaskQueue} instance
   */
  afterEach: function (afterEachHandler) {
    this.afterEachHandler = afterEachHandler;
    return this;
  }

};
