(function () {

    'use strict';

    var module = angular.module("app.directives", ["app.services"]);

    module.directive("scrollTo", function () {

        var scrollToDirective = {
            restrict: 'A'
        };

        scrollToDirective.link = function (scope, element, attrs) {

            element.bind('click', function (event) {

                var scrollToSelector,
                    scrollToOffset = 0,
                    preventDefault = false,
                    $scrollToSelector,
                    beforeScrollTo,
                    afterScrollTo,
                    scrollToTop,
                    currentTop,
                    duration;

                if (attrs.href !== undefined && attrs.href !== '') {
                    preventDefault = true;
                    scrollToSelector = attrs.href;
                } else {
                    scrollToSelector = attrs.scrollTo;
                }

                attrs.scrollToOffset = attrs.scrollToOffset || $('body').attr('scroll-to-offset');
                if (attrs.scrollToOffset !== undefined &&
                    attrs.scrollToOffset !== '') {
                    scrollToOffset = attrs.scrollToOffset;
                }

                // check a selector is present
                if (scrollToSelector === undefined ||
                    scrollToSelector === '') {
                    return;
                }

                $scrollToSelector = $(scrollToSelector);

                // check the selector exists
                if ($scrollToSelector.length === 0) {
                    throw new Error("scrollTo directive: " + scrollToSelector + " does not exist.");
                }

                // get all before\after elements inside the scroll scope
                beforeScrollTo = $("[before-scroll-to]", $scrollToSelector);
                afterScrollTo = $("[after-scroll-to]", $scrollToSelector);

                // get the top offset to scroll too
                scrollToTop = $scrollToSelector.offset().top;

                // get the top most element's top offset
                currentTop = $('header').offset().top;

                // based on the current top offset set the duration of scroll animation
                duration = (currentTop !== (scrollToTop - scrollToOffset)) ? 1000 : 0;

                $('html, body').stop().animate(
                    {
                        scrollTop: scrollToTop - scrollToOffset
                    }, {
                        duration: duration,
                        easing: 'easeInOutExpo',
                        start: function () {
                            var index,
                                $element;

                            for (index = 0; index < afterScrollTo.length; index++) {
                                $element = $(afterScrollTo[index]);
                                $element.removeClass($element.attr("after-scroll-to"));
                            }

                            for (index = 0; index < beforeScrollTo.length; index++) {
                                $element = $(beforeScrollTo[index]);
                                $element.addClass($element.attr("before-scroll-to"));
                            }

                        },
                        complete: function () {
                            var index,
                                $element;

                            for (index = 0; index < beforeScrollTo.length; index++) {
                                $element = $(beforeScrollTo[index]);
                                $element.removeClass($element.attr("before-scroll-to"));
                            }

                            for (index = 0; index < afterScrollTo.length; index++) {
                                $element = $(afterScrollTo[index]);
                                $element.addClass($element.attr("after-scroll-to"));
                            }

                        }
                    }
                );

                if (preventDefault === true) {
                    event.preventDefault();
                }

            });

        };

        return scrollToDirective;

    });

}());