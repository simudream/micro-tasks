import {MicroTaskQueue} from './MicroTaskQueue.js';

/**
 * Class that provides beforeEach, afterEach, taskDone and taskBatchDone handlers to assist
 * with scenarios like monitoring progress of micro tasks.
 *
 * @class MonitoredTaskQueue
 */
export class MonitoredTaskQueue extends MicroTaskQueue {

  /**
   * @constructor
   * @param {Function} doneHandler
   *      called when all tasks have been completed
   */
  constructor(doneHandler) {
    super(doneHandler);
  }

  addTask(taskHandler, taskDoneHandler) {
    if (this.beforeEachHandler)
      super.addTask(this.beforeEachHandler);

    super.addTask(taskHandler);

    if (taskDoneHandler)
      super.addTask(taskDoneHandler);

    if (this.afterEachHandler)
      super.addTask(this.afterEachHandler);

    return this;
  }

  addTasks(taskBatchHandlers, taskBatchDoneHandler) {
    var index = 0, count = taskBatchHandlers.length;
    for (; index < count; index++)
      this.addTask(taskBatchHandlers[index]);

    if (taskBatchDoneHandler)
      super.addTask(taskBatchDoneHandler);

    return this;
  }

  /**
   * @method beforeEach
   * @async
   *
   * @param {Function} beforeEachHandler The method to be called before running a task
   * @return current {MicroTaskQueue} instance
   */
  beforeEach(beforeEachHandler) {
    this.beforeEachHandler = beforeEachHandler;
    return this;
  }

  /**
   * @method afterEach
   * @async
   *
   * @param {Function} afterEachHandler The method to be called before running a task
   * @return current {MicroTaskQueue} instance
   */
  afterEach(afterEachHandler) {
    this.afterEachHandler = afterEachHandler;
    return this;
  }

}


//[superAddTask] = MicroTaskQueue.prototype.addTask

//{done} = MicroTaskQueue.prototype.done