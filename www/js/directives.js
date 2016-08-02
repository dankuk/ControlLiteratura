angular.module('Encuesta.directives', [])

.directive('dynamic', function ($compile) {
	return {
		restrict: 'AE',
		replace: true,
    transclude: true,
		link: function (scope, element, attrs) {
			scope.$watch(attrs.dynamic, function(html) {
				element.html(html);
				$compile(element.contents())(scope);
			});
		}
	};
})
