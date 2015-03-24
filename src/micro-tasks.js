var library = {
  MicroTaskBreak: MicroTaskBreak,
  MicroTaskQueue: MicroTaskQueue,
  MonitoredTaskQueue: MonitoredTaskQueue
};

/* export the library */
if (typeof module !== typeof undefined && typeof module.exports !== typeof undefined) {
  /* node */
  module.exports = library;
} else {
  var indirectEval = (0, eval),
    globalThis = indirectEval('this');

  globalThis.MicroTaskBreak = MicroTaskBreak;
  globalThis.MicroTaskQueue = MicroTaskQueue;
  globalThis.MonitoredTaskQueue = MonitoredTaskQueue;
}
