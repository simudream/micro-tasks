"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var $___46__46__47_src_47_MicroTaskErrors_46_js__ = (function MicroTaskErrorsModule() {
  "use strict";
  var __moduleName = "../src/MicroTaskErrors.js";

  var MicroTaskBreak = function MicroTaskBreak(reason) {
    _classCallCheck(this, MicroTaskBreak);

    this.reason = reason;
  };

  return Object.defineProperties({}, {
    MicroTaskBreak: {
      get: function () {
        return MicroTaskBreak;
      },
      configurable: true,
      enumerable: true
    }
  });
})();
var $___46__46__47_src_47_MicroTaskQueue_46_js__ = (function MicroTaskQueueModule() {
  "use strict";
  var __moduleName = "../src/MicroTaskQueue.js";
  var MicroTaskBreak = $___46__46__47_src_47_MicroTaskErrors_46_js__.MicroTaskBreak;
  function wrapMicroTask(queue, taskHandler) {
    return function (data) {
      var result,
          handlerThrew = 1;
      try {
        result = taskHandler(data);
        handlerThrew = 0;
      } finally {
        if (handlerThrew == 1) queue.promise["catch"](queue.doneHandler);
      }
      queue.taskCount--;
      if (queue.taskCount === 0 && queue.doneHandler) {
        queue.promise.then(queue.doneHandler);
      }
      return result;
    };
  }

  var MicroTaskQueue = (function () {
    function MicroTaskQueue(doneHandler) {
      _classCallCheck(this, MicroTaskQueue);

      this.taskCount = 0;
      if (doneHandler) this.done(doneHandler);
      var this_ = this;
      this.promise = new Promise(function (resolve) {
        this_.run = resolve;
      });
    }

    _createClass(MicroTaskQueue, {
      addTask: {
        value: function addTask(taskHandler) {
          this.promise = this.promise.then(wrapMicroTask(this, taskHandler));
          this.taskCount++;
          return this;
        }
      },
      addTasks: {
        value: function addTasks(taskBatchHandlers) {
          var index = 0,
              count = taskBatchHandlers.length;
          for (; index < count; index++) this.promise = this.promise.then(wrapMicroTask(this, taskBatchHandlers[index]));
          this.taskCount += count;
          return this;
        }
      },
      done: {
        value: function done(doneHandler) {
          this.doneHandler = doneHandler;
        }
      },
      "break": {
        value: function _break(reason) {
          throw new MicroTaskBreak(reason);
        }
      }
    });

    return MicroTaskQueue;
  })();

  return Object.defineProperties({}, {
    MicroTaskQueue: {
      get: function () {
        return MicroTaskQueue;
      },
      configurable: true,
      enumerable: true
    }
  });
})();
var $___46__46__47_src_47_MonitoredTaskQueue_46_js__ = (function MonitoredTaskQueueModule() {
  "use strict";
  var __moduleName = "../src/MonitoredTaskQueue.js";
  var MicroTaskQueue = $___46__46__47_src_47_MicroTaskQueue_46_js__.MicroTaskQueue;

  var MonitoredTaskQueue = (function (_MicroTaskQueue) {
    function MonitoredTaskQueue(doneHandler) {
      _classCallCheck(this, MonitoredTaskQueue);

      _get(Object.getPrototypeOf(MonitoredTaskQueue.prototype), "constructor", this).call(this, doneHandler);
    }

    _inherits(MonitoredTaskQueue, _MicroTaskQueue);

    _createClass(MonitoredTaskQueue, {
      addTask: {
        value: function addTask(taskHandler, taskDoneHandler) {
          if (this.beforeEachHandler) _get(Object.getPrototypeOf(MonitoredTaskQueue.prototype), "addTask", this).call(this, this.beforeEachHandler);
          _get(Object.getPrototypeOf(MonitoredTaskQueue.prototype), "addTask", this).call(this, taskHandler);
          if (taskDoneHandler) _get(Object.getPrototypeOf(MonitoredTaskQueue.prototype), "addTask", this).call(this, taskDoneHandler);
          if (this.afterEachHandler) _get(Object.getPrototypeOf(MonitoredTaskQueue.prototype), "addTask", this).call(this, this.afterEachHandler);
          return this;
        }
      },
      addTasks: {
        value: function addTasks(taskBatchHandlers, taskBatchDoneHandler) {
          var index = 0,
              count = taskBatchHandlers.length;
          for (; index < count; index++) this.addTask(taskBatchHandlers[index]);
          if (taskBatchDoneHandler) _get(Object.getPrototypeOf(MonitoredTaskQueue.prototype), "addTask", this).call(this, taskBatchDoneHandler);
          return this;
        }
      },
      beforeEach: {
        value: function beforeEach(beforeEachHandler) {
          this.beforeEachHandler = beforeEachHandler;
          return this;
        }
      },
      afterEach: {
        value: function afterEach(afterEachHandler) {
          this.afterEachHandler = afterEachHandler;
          return this;
        }
      }
    });

    return MonitoredTaskQueue;
  })(MicroTaskQueue);

  return Object.defineProperties({}, {
    MonitoredTaskQueue: {
      get: function () {
        return MonitoredTaskQueue;
      },
      configurable: true,
      enumerable: true
    }
  });
})();
var $___46__46__47_src_47_MicroTasks_46_js__ = (function MicroTasksModule() {
  "use strict";
  var __moduleName = "../src/MicroTasks.js";
  var MicroTaskBreak = $___46__46__47_src_47_MicroTaskErrors_46_js__.MicroTaskBreak;
  var MicroTaskQueue = $___46__46__47_src_47_MicroTaskQueue_46_js__.MicroTaskQueue;
  var MonitoredTaskQueue = $___46__46__47_src_47_MonitoredTaskQueue_46_js__.MonitoredTaskQueue;
  var MicroTasks = {
    MicroTaskBreak: MicroTaskBreak,
    MicroTaskQueue: MicroTaskQueue,
    MonitoredTaskQueue: MonitoredTaskQueue
  };
  return Object.defineProperties({}, {
    MicroTasks: {
      get: function () {
        return MicroTasks;
      },
      configurable: true,
      enumerable: true
    }
  });
})();


var q = new $___46__46__47_src_47_MicroTasks_46_js__.MicroTasks.MicroTaskQueue();
var results = [];
for(var i = 0; i<10; i++)
  q.addTask( function eachTask() {
    results.push(i)
  });

