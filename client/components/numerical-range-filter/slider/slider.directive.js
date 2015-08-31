'use strict';

angular.module('digApp')
.directive('slider', function() {
    return {
        restrict: 'E',
        scope: {
            rangeFilter: '='
        },
        templateUrl: 'components/numerical-range-filter/slider/slider.partial.html',
        link: function($scope, element) {

            var getSliderElem = function() {
                return angular.element(element[0].querySelector('.range-slider'));
            };

            var updateRangeLabel = function(from, to) {
                angular.element(element[0].querySelector('input.range')).val(from + ' - ' + to);
            };            

            var resetMinAndMax = function(minVal, maxVal) {
                getSliderElem().slider('option', 'min', minVal);
                getSliderElem().slider('option', 'max', maxVal);
                getSliderElem().slider('option', 'values', [minVal, maxVal]);
            };

            $scope.initSlider = function() {

                getSliderElem().slider({
                    range: true,
                    min: $scope.rangeFilter.min,
                    max: $scope.rangeFilter.max,
                    values: [$scope.rangeFilter.min, $scope.rangeFilter.max],
                    slide: function(event, ui) {
                        updateRangeLabel(ui.values[0], ui.values[1]);
                    },
                    stop: function(event, ui) {
                        $scope.rangeFilter = {
                            begin: ui.values[0],
                            end: ui.values[1],
                            enabled: true
                        };
                        getSliderElem().slider('option', 'values', [$scope.rangeFilter.begin, $scope.rangeFilter.end]);
                        updateRangeLabel(ui.values[0], ui.values[1]);
                        $scope.$apply();
                    }

                });

                updateRangeLabel(getSliderElem().slider('values', 0), getSliderElem().slider('values', 1));
            };

            $scope.initSlider();

            $scope.$watch('rangeFilter', function() {
                var minVal = $scope.rangeFilter.min;
                var maxVal = $scope.rangeFilter.max === $scope.rangeFilter.min ? $scope.rangeFilter.max + 1 : $scope.rangeFilter.max;

                if($scope.rangeFilter.enabled) {
                    if($scope.rangeFilter.begin >= minVal) {
                        getSliderElem().slider('option', 'min', minVal); 
                    }

                    if($scope.rangeFilter.end <= maxVal) {
                        getSliderElem().slider('option', 'max', maxVal);
                    } 
                } else {
                    resetMinAndMax(minVal, maxVal);
                } 
                updateRangeLabel(getSliderElem().slider('values', 0), getSliderElem().slider('values', 1));  
            }, true);
        }
    };
});