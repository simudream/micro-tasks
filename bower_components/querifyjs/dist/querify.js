(function() {
    "use strict";
    function Query(queryOperations, queryComparisons, queryStackTrace, sharedContext) {
        this.opMethods = queryOperations;
        this.compareMethods = queryComparisons;
        this.trace = queryStackTrace;
        this.sharedContext = sharedContext || {};
    }
    Query.prototype = {
        extract: function(modelDictionary, query) {
            var context = this;
            context.trace.reset();
            if (modelDictionary === undefined) {
                throw new ReferenceError("Unspecified model dictionary.");
            }
            if (query === undefined) {
                throw new ReferenceError("Unspecified query.");
            }
            var keys = Object.keys(modelDictionary);
            var filteredDictionary = {};
            keys.forEach(function(modelKey, modelIndex) {
                context.trace.stackLevel = 0;
                context.trace.write([ "$$extract", modelIndex ]);
                var model = modelDictionary[modelKey];
                var result = context.opMethods.executeQuery.call(context, model, query, false);
                if (result === true) {
                    filteredDictionary[modelKey] = model;
                }
            });
            return filteredDictionary;
        },
        filter: function(modelArray, query) {
            var context = this;
            context.trace.reset();
            if (modelArray === undefined) {
                throw new ReferenceError("Unspecified model array.");
            }
            if (query === undefined) {
                throw new ReferenceError("Unspecified query.");
            }
            var filteredList = [];
            modelArray.forEach(function(model, modelIndex) {
                context.trace.stackLevel = 0;
                context.trace.write([ "$$filter", modelIndex ]);
                var result = context.opMethods.executeQuery.call(context, model, query, false);
                if (result === true) {
                    filteredList.push(model);
                }
            });
            return filteredList;
        },
        every: function(modelArray, query) {
            var context = this;
            context.trace.reset();
            if (modelArray === undefined) {
                throw new ReferenceError("Unspecified model array.");
            }
            if (query === undefined) {
                throw new ReferenceError("Unspecified query.");
            }
            return modelArray.every(function(model, modelIndex) {
                context.trace.stackLevel = 0;
                context.trace.write([ "$$every", modelIndex ]);
                return context.opMethods.executeQuery.call(context, model, query, false);
            });
        },
        one: function(model, query) {
            var context = this;
            context.trace.reset();
            if (model === undefined) {
                throw new ReferenceError("Unspecified model.");
            }
            if (query === undefined) {
                throw new ReferenceError("Unspecified query.");
            }
            return context.opMethods.executeQuery.call(context, model, query, false);
        },
        some: function(modelArray, query) {
            var context = this;
            context.trace.reset();
            if (modelArray === undefined) {
                throw new ReferenceError("Unspecified model array.");
            }
            if (query === undefined) {
                throw new ReferenceError("Unspecified query.");
            }
            return modelArray.some(function(model, modelIndex) {
                context.trace.stackLevel = 0;
                context.trace.write([ "$$some", modelIndex ]);
                return context.opMethods.executeQuery.call(context, model, query, false);
            });
        }
    };
    "use strict";
    function QueryComparisons() {}
    QueryComparisons.prototype = {
        $default: function(modelValue, testValue) {
            if (testValue instanceof RegExp) return this.compareMethods.$regexp(modelValue, testValue); else return this.compareMethods.$equals(modelValue, testValue);
        },
        $equals: function(modelValue, testValue) {
            return modelValue === testValue;
        },
        $length: function(modelValue, testValue) {
            return modelValue.length == testValue;
        },
        $regexp: function(modelValue, testValue) {
            return testValue.test(modelValue);
        },
        $left: function(modelValue, testValue) {
            return modelValue.substring(0, testValue.length) === testValue;
        },
        $right: function(modelValue, testValue) {
            var offset = modelValue.length - testValue.length;
            return modelValue.substring(offset) === testValue;
        },
        $typeof: function(modelValue, testValue) {
            return typeof modelValue === testValue;
        },
        $instanceof: function(modelValue, testValue) {
            return modelValue instanceof testValue;
        },
        $toLowerCase: function(modelValue, testValue) {
            return modelValue.toLowerCase() === testValue;
        },
        $toUpperCase: function(modelValue, testValue) {
            return modelValue.toUpperCase() === testValue;
        },
        $inArray: function(modelValue, testArray) {
            return testArray.indexOf(modelValue) !== -1;
        },
        $has: function(modelValue, testValue) {
            if (testValue instanceof Array) {
                return testValue.every(function(testItemValue) {
                    return testItemValue in modelValue;
                });
            } else {
                return testValue in modelValue;
            }
        },
        $g: function(modelValue, testValue) {
            return modelValue > testValue;
        },
        $gte: function(modelValue, testValue) {
            return modelValue >= testValue;
        },
        $lte: function(modelValue, testValue) {
            return modelValue <= testValue;
        },
        $l: function(modelValue, testValue) {
            return modelValue < testValue;
        },
        $e: function(modelValue, testValue) {
            return modelValue == testValue;
        },
        $ne: function(modelValue, testValue) {
            return modelValue != testValue;
        },
        $queryOne: function(modelValue, query) {
            return this.opMethods.executeQuery.call(this, modelValue, query, false);
        },
        $queryEvery: function(modelArray, query) {
            var scope = this;
            return modelArray.every(function(model) {
                return scope.opMethods.executeQuery.call(scope, model, query, false);
            });
        },
        $querySome: function(modelArray, query) {
            var scope = this;
            return modelArray.some(function(model) {
                return scope.opMethods.executeQuery.call(scope, model, query, false);
            });
        }
    };
    "use strict";
    function QueryOperations() {}
    QueryOperations.prototype = {
        throwError: function(error) {
            throw error;
        },
        $and: function(model, operations, negateCompare, modelValue) {
            this.trace.write("$and");
            return this.opMethods.executeQuery.call(this, model, operations, negateCompare, modelValue);
        },
        $or: function(model, operations, negateCompare, modelValue) {
            this.trace.write("$or");
            return this.opMethods.executeQuery.call(this, model, operations, negateCompare, modelValue);
        },
        $not: function(model, operations, modelValue) {
            var stackIndex = this.trace.stackLevel;
            this.trace.write("$not");
            var result = this.opMethods.executeQuery.call(this, model, operations, true, modelValue);
            this.trace.stack[stackIndex - 1].result = result;
            return result;
        },
        executeCompare: function(operationkey, operations, negateCompare, modelValue, reject) {
            this.trace.write(operationkey);
            var compareMethod = this.compareMethods[operationkey];
            if (compareMethod === undefined) {
                reject(new ReferenceError("No compare method was found for: " + operationkey));
                return;
            }
            var compareValue = operations[operationkey];
            var result = compareMethod.call(this, modelValue, compareValue);
            if (negateCompare) {
                result = !result;
            }
            var traceStack = this.trace.stack;
            traceStack[traceStack.length - 1].result = result;
            return result;
        },
        executeValueOperations: function(model, operationkey, operations, negateCompare, reject) {
            this.trace.write(operationkey);
            var modelValue = model[operationkey];
            var descendantOps = operations[operationkey];
            if (descendantOps === undefined) {
                reject(new ReferenceError("No operation property was found for: " + operationkey));
                return;
            }
            return this.opMethods.executeQuery.call(this, model, descendantOps, negateCompare, modelValue);
        },
        executeQuery: function(model, operations, negateCompare, modelValue) {
            var context = this, operationKeys, hasOrOperation;
            if (negateCompare === undefined) {
                negateCompare = false;
            }
            context.trace.stackLevel++;
            if (operations instanceof RegExp || typeof operations !== "object") {
                operations = {
                    $default: operations
                };
            }
            operationKeys = Object.keys(operations);
            hasOrOperation = "$or" in operations;
            if (hasOrOperation === true) {
                operationKeys = operationKeys.filter(function(element) {
                    return element !== "$or";
                });
            }
            var everyResult = operationKeys.every(function(operationkey) {
                var result = false;
                if (operationkey[0] === "$") {
                    if (modelValue === undefined) {
                        modelValue = model;
                    }
                    if (operationkey === "$not") {
                        result = context.opMethods.$not.call(context, model, operations.$not, modelValue);
                    } else if (operationkey === "$and") {
                        result = context.opMethods.$and.call(context, model, operations.$and, negateCompare, modelValue);
                    } else {
                        result = context.opMethods.executeCompare.call(context, operationkey, operations, negateCompare, modelValue, context.opMethods.throwError);
                    }
                } else {
                    result = context.opMethods.executeValueOperations.call(context, model, operationkey, operations, negateCompare, context.opMethods.throwError);
                }
                return result;
            });
            if (operationKeys.length === 0) {
                everyResult = false;
            }
            if (hasOrOperation && everyResult === false) {
                everyResult = context.opMethods.$or.call(context, model, operations.$or, negateCompare, modelValue);
            }
            context.trace.stackLevel--;
            return everyResult;
        }
    };
    "use strict";
    function QueryPromise(queryOperations, queryComparisons, queryStackTrace, sharedContext) {
        this.opMethods = queryOperations;
        this.compareMethods = queryComparisons;
        this.trace = queryStackTrace;
        this.sharedContext = sharedContext || {};
    }
    QueryPromise.prototype = {
        extract: function(modelDictionary, query) {
            var context = this;
            context.trace.reset();
            if (modelDictionary === undefined) {
                return Promise.reject(new ReferenceError("Unspecified model dictionary."));
            }
            if (query === undefined) {
                return Promise.reject(new ReferenceError("Unspecified query."));
            }
            var chainedThen = Promise.resolve({});
            var keys = Object.keys(modelDictionary);
            keys.forEach(function(modelKey, modelIndex) {
                chainedThen = chainedThen.then(function(filteredDictionary) {
                    context.trace.stackLevel = 0;
                    context.trace.write([ "$$extract", modelIndex ]);
                    var model = modelDictionary[modelKey];
                    return context.opMethods.executeQuery.call(context, model, query, false).then(function(result) {
                        if (result === true) {
                            filteredDictionary[modelKey] = model;
                        }
                        return filteredDictionary;
                    });
                });
            });
            return chainedThen;
        },
        filter: function(modelArray, query) {
            var context = this;
            context.trace.reset();
            if (modelArray === undefined) {
                return Promise.reject(new ReferenceError("Unspecified model array."));
            }
            if (query === undefined) {
                return Promise.reject(new ReferenceError("Unspecified query."));
            }
            var chainedThen = Promise.resolve([]);
            modelArray.forEach(function(model, modelIndex) {
                chainedThen = chainedThen.then(function(filteredList) {
                    context.trace.stackLevel = 0;
                    context.trace.write([ "$$filter", modelIndex ]);
                    return context.opMethods.executeQuery.call(context, model, query, false).then(function(result) {
                        if (result === true) {
                            filteredList.push(model);
                        }
                        return filteredList;
                    });
                });
            });
            return chainedThen;
        },
        every: function(modelArray, query) {
            var context = this;
            context.trace.reset();
            if (modelArray === undefined) {
                return Promise.reject(new ReferenceError("Unspecified model array."));
            }
            if (query === undefined) {
                return Promise.reject(new ReferenceError("Unspecified query."));
            }
            return promiseExtras.every(modelArray, function(model, modelIndex, fulfil) {
                context.trace.stackLevel = 0;
                context.trace.write([ "$$every", modelIndex ]);
                fulfil(context.opMethods.executeQuery.call(context, model, query, false));
            });
        },
        one: function(model, query) {
            var context = this;
            context.trace.reset();
            if (model === undefined) {
                return Promise.reject(new ReferenceError("Unspecified model."));
            }
            if (query === undefined) {
                return Promise.reject(new ReferenceError("Unspecified query."));
            }
            return context.opMethods.executeQuery.call(context, model, query, false);
        },
        some: function(modelArray, query) {
            var context = this;
            context.trace.reset();
            if (modelArray === undefined) {
                return Promise.reject(new ReferenceError("Unspecified model array."));
            }
            if (query === undefined) {
                return Promise.reject(new ReferenceError("Unspecified query."));
            }
            return promiseExtras.some(modelArray, function(model, modelIndex, fulfil) {
                context.trace.stackLevel = 0;
                context.trace.write([ "$$some", modelIndex ]);
                fulfil(context.opMethods.executeQuery.call(context, model, query, false));
            });
        }
    };
    "use strict";
    function QueryPromiseComparisons() {}
    var classProto = Object.create(QueryComparisons.prototype);
    classProto.$queryEvery = function(modelArray, query) {
        var scope = this;
        return promiseExtras.every(modelArray, function(model, modelIndex, fulfil) {
            fulfil(scope.opMethods.executeQuery.call(scope, model, query, false));
        });
    };
    classProto.$querySome = function(modelArray, query) {
        var scope = this;
        return promiseExtras.some(modelArray, function(model, modelIndex, fulfil) {
            fulfil(scope.opMethods.executeQuery.call(scope, model, query, false));
        });
    };
    QueryPromiseComparisons.prototype = classProto;
    "use strict";
    function QueryPromiseOperations() {}
    var classProto = Object.create(QueryOperations.prototype);
    classProto.executeQuery = function(model, operations, negateCompare, modelValue) {
        var context = this, operationKeys, hasOrOperation;
        if (negateCompare === undefined) {
            negateCompare = false;
        }
        context.trace.stackLevel++;
        if (operations instanceof RegExp || typeof operations !== "object") {
            operations = {
                $default: operations
            };
        }
        operationKeys = Object.keys(operations);
        hasOrOperation = "$or" in operations;
        if (hasOrOperation === true) {
            operationKeys = operationKeys.filter(function(element) {
                return element !== "$or";
            });
        }
        return promiseExtras.every(operationKeys, function(operationkey, operationIndex, fulfil, reject) {
            var result = false;
            if (operationkey[0] === "$") {
                if (modelValue === undefined) {
                    modelValue = model;
                }
                if (operationkey === "$not") {
                    result = context.opMethods.$not.call(context, model, operations.$not, modelValue);
                } else if (operationkey === "$and") {
                    result = context.opMethods.$and.call(context, model, operations.$and, negateCompare, modelValue);
                } else {
                    result = context.opMethods.executeCompare.call(context, operationkey, operations, negateCompare, modelValue, reject);
                }
            } else {
                result = context.opMethods.executeValueOperations.call(context, model, operationkey, operations, negateCompare, reject);
            }
            fulfil(result);
        }).then(function(result) {
            if (operationKeys.length === 0) {
                result = false;
            }
            if (hasOrOperation && result === false) {
                result = context.opMethods.$or.call(context, model, operations.$or, negateCompare, modelValue);
            }
            return result;
        }).then(function(result) {
            context.trace.stackLevel--;
            return result;
        });
    };
    QueryPromiseOperations.prototype = classProto;
    "use strict";
    function QueryStackTrace() {
        this.reset();
    }
    QueryStackTrace.prototype = {
        reset: function() {
            this.stack = [];
            this.stackLevel = 0;
        },
        write: function(operation) {
            var newStackEntry = {
                level: this.stackLevel,
                operation: operation
            };
            this.stack.push(newStackEntry);
        }
    };
    "use strict";
    var isBrowser = typeof window !== typeof undefined, $Promise, $promiseExtras;
    function resolveBrowserPromiseLib() {
        if (window.Promise) {
            return window.Promise;
        } else {
            throw new ReferenceError("Promise library could not be detected for this browser.");
        }
    }
    function resolveBrowserPromiseExtrasLib() {
        if (window.promiseExtras) {
            return window.promiseExtras;
        } else {
            throw new ReferenceError("Promise-extras library could not be detected for this browser.");
        }
    }
    function lazyLoadPromiseDeps() {
        if (isBrowser === true) {
            $Promise = resolveBrowserPromiseLib();
        } else {
            $Promise = require("promise");
        }
        if (isBrowser === true) {
            $promiseExtras = resolveBrowserPromiseExtrasLib();
        } else {
            $promiseExtras = require("promise-extras");
        }
    }
    var defaultPromiseInstance;
    var querifyLibrary = {
        get promise() {
            if (defaultPromiseInstance === undefined) {
                lazyLoadPromiseDeps();
                defaultPromiseInstance = new QueryPromise(new QueryPromiseOperations(), new QueryPromiseComparisons(), new QueryStackTrace());
            }
            return defaultPromiseInstance;
        },
        sync: new Query(new QueryOperations(), new QueryComparisons(), new QueryStackTrace()),
        Query: Query,
        QueryOperations: QueryOperations,
        QueryStackTrace: QueryStackTrace,
        get QueryPromise() {
            if (defaultPromiseInstance === undefined) lazyLoadPromiseDeps();
            return QueryPromise;
        },
        get QueryPromiseOperations() {
            if (defaultPromiseInstance === undefined) lazyLoadPromiseDeps();
            return QueryPromiseOperations;
        },
        get QueryPromiseComparisons() {
            if (defaultPromiseInstance === undefined) lazyLoadPromiseDeps();
            return QueryPromiseComparisons;
        }
    };
    if (typeof window !== typeof undefined) {
        window.querify = querifyLibrary;
    } else if (typeof module !== typeof undefined && typeof module.exports !== typeof undefined) {
        module.exports = querifyLibrary;
    } else {
        exports = querifyLibrary;
    }
})();