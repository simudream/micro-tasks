(function () {
	"use strict";

	var isBrowser = typeof window !== "undefined",
		$Promise;

	function resolveBrowserPromiseLib() {
		if (window.Promise) {
			return window.Promise;
		} else {
			throw new Error("No Promise library could be detected for this browser.");
		}
	}

	// attempt to get the Promise ref
	if (isBrowser === true) {
		$Promise = resolveBrowserPromiseLib();
	} else {
		$Promise = require("promise");
	}

	var promiseExtras = (function (Promise) {

		function promiseEveryTask(arrayItems, itemHandler, currentIndex) {

			var context = this,
				nextPromise = function nextPromise(resolve, reject) {

					function nextItemHandler() {

						var wasResolved = false,
							wasRejected = false;

						itemHandler.call(context, arrayItems[currentIndex], currentIndex,
							function handleUserResolver(userResolver) {

								// check if this was already resolved
								if (wasResolved === true) {
									reject(Error("Resolve cannot be called more than once."));
									return;
								}

								// check for rejection
								if (wasRejected === true) {
									return;
								}

								wasResolved = true;

								// handles the user resolver as a value or a Promise
								var promiseResolver = Promise.resolve(userResolver);

								promiseResolver.then(function (result) {

									// check for rejection
									if (wasRejected === true) {
										return;
									}

									// if result is a boolean and true then continue the iteration
									if (result === true) {

										currentIndex++;

										if (currentIndex < arrayItems.length) {
											resolve(
												promiseEveryTask.call(context, arrayItems, itemHandler, currentIndex)
											);
										} else {
											// iteration ended successfully
											resolve(true);
										}

									} else {
										// just pass on the result
										resolve(result);
									}

								}).catch(function (error) {
									wasRejected = true;
									reject(error);
								});

							}, function handleUserRejection(error) {
								// check for rejection
								if (wasRejected === true) {
									throw new Error("Reject cannot be called more than once.");
								}

								wasRejected = true;
								reject(error);
							});

						// when wasResolved and wasRejected is false (throw error)
						if (wasResolved === false && wasRejected === false)
							reject(new ReferenceError("promiseEvery was not resolved or rejected."));

					}

					setTimeout(nextItemHandler, 0);
				};

			return new Promise(nextPromise);
		}

		function promiseSomeTask(arrayItems, itemHandler, currentIndex) {

			var context = this,
				nextPromise = function (resolve, reject) {

					function nextItemHandler() {

						var wasResolved = false,
							wasRejected = false;

						itemHandler.call(context, arrayItems[currentIndex], currentIndex,
							function handleUserResolver(userResolver) {

								// check if this was already resolved
								if (wasResolved === true) {
									reject(Error("Resolve cannot be called more than once."));
									return;
								}

								// check for rejection
								if (wasRejected === true) {
									return;
								}

								wasResolved = true;

								// will handle the user resolver as a value or a Promise
								var promiseResolver = Promise.resolve(userResolver);

								promiseResolver.then(function (result) {

									// check for rejection
									if (wasRejected === true) {
										return;
									}

									// if result is a false then continue the iteration
									if (result === false) {

										currentIndex++;

										if (currentIndex < arrayItems.length) {
											resolve(
												promiseSomeTask.call(context, arrayItems, itemHandler, currentIndex)
											);
										} else {
											// iteration ended
											resolve(false);
										}

									} else if (result === true) {
										resolve(true);
									} else {
										resolve(false);
									}

								}).catch(function (error) {
									wasRejected = true;
									reject(error);
								});

							}, function handleUserRejection(error) {
								// check for rejection
								if (wasRejected === true) {
									throw new Error("Reject cannot be called more than once.");
								}

								wasRejected = true;
								reject(error);
							});

						// when wasResolved and wasRejected is false (throw error)
						if (wasResolved === false && wasRejected === false)
							reject(new ReferenceError("promiseEvery was not resolved or rejected."));
					}

					setTimeout(nextItemHandler, 0);
				};

			return new Promise(nextPromise);
		}

		function promiseEvery(arrayItems, itemHandler) {

			if (!arrayItems) {
				throw new ReferenceError("Unspecified array items.")
			}

			if (!itemHandler) {
				throw new ReferenceError("Unspecified item handler method.")
			}

			if (arrayItems.length === 0) {
				return Promise.resolve(true);
			}

			// returns a Promise to the first item in the iteration
			return promiseEveryTask.call(this, arrayItems, itemHandler, 0);
		}

		function promiseSome(arrayItems, itemHandler) {

			if (!arrayItems) {
				throw new ReferenceError("Unspecified array items.")
			}

			if (!itemHandler) {
				throw new ReferenceError("Unspecified item handler method.")
			}

			if (arrayItems.length === 0) {
				return Promise.resolve(false);
			}

			// returns a Promise
			return promiseSomeTask.call(this, arrayItems, itemHandler, 0);
		}

		function promiseLater(resolution, timeout) {
			if (!resolution) {
				throw new ReferenceError("Unspecified resolution callback.")
			}

			var context = this,
				resTimeout = timeout || 0;

			return new Promise(function (resolve, reject) {
				setTimeout(function () {
					resolution.call(context, resolve, reject);
				}, resTimeout);
			});

		}

		function promiseAttach(attachToPromise, thenArray) {

			if (!attachToPromise) {
				throw new ReferenceError("Unspecified source promise.")
			}

			if (!thenArray) {
				throw new ReferenceError("Unspecified attach array.")
			}

			thenArray.forEach(function (arrayValue) {

				if (typeof arrayValue === 'function')
					attachToPromise = attachToPromise.then(arrayValue);
				else
					attachToPromise = attachToPromise.then(function onResolve() {
						// ignores any input and passback the array item
						return arrayValue;
					});

			});

			// chain
			return attachToPromise;
		}

		/**
		 * @class promiseExtras
		 */
		return {
			attach: promiseAttach,
			every: promiseEvery,
			later: promiseLater,
			some: promiseSome
		};

	}($Promise));

	/* export the library */
	if (isBrowser) {
		/* browser */
		window.promiseExtras = promiseExtras;
	} else if (typeof module !== "undefined" &&
		typeof module.exports !== "undefined") {
		/* node */
		module.exports = promiseExtras;
	}

}());