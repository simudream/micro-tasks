/**
 * ###A helper library for working with JS Promises
 *
 * Installing:
 *
 * ####NodeJs:
 *
 * Will automatically reference any dependencies.
 *
 *      run ```npm install promise-extras --save```
 *
 * ####Browser:
 *
 *      <script type="application/javascript" src="path/to/lib/promise-extras.min.js"></script>
 *
 * ####Bower:
 *
 *      run ```bower install promise-extras --save```
 *
 * @module promiseExtras
 */

/**
 * Global class
 * @class promiseExtras
 * @static
 */

/**
 *  Iterates over an array and tests whether all elements in the array pass the test implemented by the provided callback function.
 *
 *  Note:
 *
 *      Each iteration is processed one at a time and the iteration order is preserved (inc. async callback).
 *
 *      During the itemHandler callback, resolve or reject must be called before it''s method exits
 *      otherwise an error will be thrown. You can defer this process by passing a Promise to the resolve method.
 *      See last example below
 *
 * @method every
 * @for promiseExtras
 * @async
 * @static
 *
 * @param {Array} arrayItems The array to be iterated
 * @param {Function} itemHandler
 * @param {Object} itemHandler.item current array item.
 * @param {Number} itemHandler.index current array item index.
 * @param {Function} itemHandler.resolve used for determining iteration flow.
 *
 *      Calling resolve(true) will continue the iteration until finally causing the returned {Promise} object to execute it's then(...) method passing the last result {Object}
 *
 *       Calling resolve({Promise}) will use the result from the passed {Promise} object
 *
 *       Calling resolve({Object}) will break the iteration and cause the returned {Promise} object to execute it's then(...) method passing the last result {Object}
 *
 * @param {Function} itemHandler.reject used for handling iteration errors.
 *
 *      Calling reject({Object}) will break the current iteration and cause the returned {Promise} object to execute it's catch(...) handler method passing it the result {Object}
 *
 * @return {Promise} A reference to the completion {Promise} object
 *
 *      Will be called once the iteration has finished or rejected.
 *      The result of the last iteration will be given to the then(...) method if the iteration had not been rejected
 *      Use catch(...) to handle any rejections or errors the occurred during the iteration
 *
 * @example
		// reference the library
		var promiseX = window.promiseExtras; // or require("promise-extras") in nodejs
 *
 * @example
 *
        // the array to iterate
        var items = [1, 2, 3, 4, 5];
		// iterates all items
		promiseX.every(items, function (arrayItem, arrayIndex, resolve, reject) {
			resolve(true);
		}).then(function (lastResolveResult) {
			// will print true
			console.log(lastResolveResult);
		});
 *
 * @example
 *
		// breaks the loop on the first call
		promiseX.every(items, function (arrayItem, arrayIndex, resolve, reject) {
			resolve(false); // breaks here
		}).then(function (lastResolveResult) {
			// will print false
			console.log(lastResolveResult);
		});
 *
 * @example
 *
		// causes catch(...) to be called
		// breaks the loop on the first call
		promiseX.every(items, function (arrayItem, arrayIndex, resolve, reject) {
			reject(new Error("Break here"));
		}).catch (function (error) {
			// will print the error
			console.log(error);
		});
 *
 * @example
 *
		// iterates items in order even with async calls
		var results = [];
		promiseX.every(items, function (arrayItem, arrayIndex, resolve, reject) {

			// because resolve or reject must be called before this method exits
			// then we resolve using a Promise which lets us defer the result.
			// use the Promise result for resolve or rejection of this iteration.
			// i.e. innerResolve(false) would break the iteration

			if (arrayIndex === 2)

				resolve(

					new Promise(function (innerResolve, innerReject) {

						// async ( go do something for a period of time )
						setTimeout(function () {
							results.push(arrayIndex);
							innerResolve(true);
						}, 2000);

					}));
			else {
				// sync
				results.push(arrayIndex);
				resolve(true);
			}

		}).then(function () {
			// will print true
			console.log(results);
		}).catch (function (error) {
			// will print the error
			console.log(error);
		});
 *
 */

/**
 *  Iterates over an array and tests whether any elements in the array pass the test implemented by the provided callback function.
 *  Will iterate until one true match is found and execute the then(...) method with a result of true, otherwise it will be false
 *
 *  Note:
 *
 *      Each iteration is processed one at a time and the iteration order is preserved (inc. async callback).
 *
 *      During the itemHandler callback, resolve or reject must be called before it''s method exits
 *      otherwise an error will be thrown. You can defer this process by passing a Promise to the resolve method.
 *      See last example below
 *
 * @method some
 * @for promiseExtras
 * @async
 * @static
 *
 * @param {Array} arrayItems The array to be iterated
 * @param {Function} itemHandler
 * @param {Object} itemHandler.item current array item.
 * @param {Number} itemHandler.index current array item index.
 * @param {Function} itemHandler.resolve used for determining iteration flow.
 *
 *      Calling resolve(true) will end the iteration causing the returned {Promise} object to execute it's then(...) method passing true as the result {Object}
 *
 *       Calling resolve({Promise}) will use the result from the passed {Promise} object
 *
 *       Calling resolve({Object}) will break the iteration and cause the returned {Promise} object to execute it's then(...) method passing the last result {Object}
 *
 * @param {Function} itemHandler.reject used for handling iteration errors.
 *
 *      Calling reject({Object}) will break the current iteration and cause the returned {Promise} object to execute it's catch(...) handler method passing it the result {Object}
 *
 * @return {Promise} A reference to the completion {Promise} object
 *
 *      Will be called once the iteration has finished or rejected.
 *      The result will be given to the then(...) method if the iteration had not been rejected
 *      Use catch(...) to handle any rejections or errors the occurred during the iteration
 *
 * @example
        // reference the library
        var promiseX = window.promiseExtras; // or require("promise-extras") in nodejs
        // the array to iterate
        var items = [1, 2, 3, 4, 5];
 *
 * @example
 *
        // iterates all items
        promiseX.some(items, function (arrayItem, arrayIndex, resolve, reject) {
            resolve(arrayIndex === 3);
        }).then(function (lastResolveResult) {
            // will print true
            console.log(lastResolveResult);
        });
 *
 * @example
 *
        // breaks the loop on the first call
        promiseX.some(items, function (arrayItem, arrayIndex, resolve, reject) {
            resolve(arrayIndex === 7);
        }).then(function (lastResolveResult) {
            // will print false
            console.log(lastResolveResult);
        });
 *
 * @example
 *
        // causes catch(...) to be called
        // breaks the loop on the first call
        promiseX.some(items, function (arrayItem, arrayIndex, resolve, reject) {
            reject(new Error("Break here"));
        }).catch (function (error) {
            // will print the error
            console.log(error);
        });
 *
 * @example
 *
         // iterates items in order even with async calls
         var results = [];
         promiseX.other(items, function (arrayItem, arrayIndex, resolve, reject) {

            // because resolve or reject must be called before this method exits
            // then we resolve using a Promise which lets us defer the result.
            // use the Promise result for resolve or rejection of this iteration.
            // i.e. innerResolve(false) would break the iteration

            if (arrayIndex === 2)
                resolve(
                    new Promise(function (innerResolve, innerReject) {
                        // async ( go do something for a period of time )
                        setTimeout(function () {
                            results.push(arrayIndex);
                            innerResolve(true);
                        }, 2000);
                    }));
            else {
                // sync
                results.push(arrayIndex);
                resolve(false); // keep iterating
            }
        }).then(function () {
            // will print true
            console.log(results);
        }).catch (function (error) {
            // will print the error
            console.log(error);
        });
 */

/**
 * Creates a Promise who won't be resolved until the calling method exits and the specified timeout has been met.
 *
 * @method later
 * @for promiseExtras
 * @async
 * @static
 *
 * @param {Function} promise Resolution callback
 *
 *      function resolution(resolve, reject){}
 *
 * @param {Number} timeout Value passed to the setTimeout function. Can be omitted, default is 0
 *
 * @return {Promise} A reference to the completion {Promise} object
 *
 * @example
		// reference the library
		var promiseX = window.promiseExtras; // or require("promise-extras") in nodejs
		var timeout = 0; // can be omitted, 0 default

		promiseX.later( function(resolve, reject) {
		    resolve(123);
		}, timeout);
 *
 */

/**
 * Attaches an array of thenables to the source promise
 * @method attach
 * @for promiseExtras
 * @static
 *
 * @param {Promise} promise The promise to attach the thenArray to
 * @param {Array} thenArray an array of thenables to attach to the source promise
 *
 * @return {Promise} a promise who's then method will return the last result from the attached array
 *
 *
 * @example
		// increments the starting value
		function inc(inValue) {
			return inValue + 1;
		}

		// outputs the last value to the console
		function log(inValue) {
			console.log(inValue)
			// don't touch the value just pass it on
			return inValue;
		}

		// starting value
		var sourcePromise = Promise.resolve(1);

		var thenArray = [
			inc,
			inc,
			inc,
			log
		];

		promiseX.attach(sourcePromise, thenArray)
			.then(function (finalValue) {
				// finalValue will be 4
			});
 */