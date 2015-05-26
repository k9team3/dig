'use strict';

angular.module('digApp')
.controller('FolderCtrl', ['$scope', '$http', '$state', 'euiSearchIndex', 'imageSearchService',
    function($scope, $http, $state, euiSearchIndex, imageSearchService) {
      $scope.selectedItems = [];

      $scope.init = function() {
        $scope.showresults = true;
        $scope.filterFolder = {
            enabled: false
        };
        $scope.retrieveFolder();
      };

      $scope.retrieveFolder = function() {
        if($scope.selectedFolder._id) {
          $http.get('api/folders/' + $scope.selectedFolder._id).
            success(function(data) {
              $scope.items = data.items;
              $scope.childFolderIds = data.childIds;

              $scope.searchConfig.euiSearchIndex = euiSearchIndex;
              $scope.filterFolder.enabled = true;
            });
        }
      };

      $scope.getDisplayImageSrc = function(doc) {
          var src = '';
          var currentSearch = imageSearchService.getActiveImageSearch();

          // Default behavior.  Grab the only cached versions of the images from our docs.
          if(doc._source.hasImagePart && doc._source.hasImagePart.cacheUrl) {
              src = doc._source.hasImagePart.cacheUrl;
          } else if(doc._source.hasImagePart[0] && doc._source.hasImagePart[0].cacheUrl) {
              src = doc._source.hasImagePart[0].cacheUrl;
          }

          /* jshint camelcase:false */
          // If we have an active image search, check for a matching image.
          if(currentSearch &&
              imageSearchService.isImageSearchEnabled(currentSearch.url) &&
              doc._source.hasFeatureCollection.similar_images_feature) {
              var imgFeature = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                  function(item) {
                      return item.featureValue === currentSearch.url;
                  });

              // Verify that the current search url is in the similar images feature.  If so, select the matching
              // image.
              if(imgFeature) {
                  var imgObj = _.find(doc._source.hasFeatureCollection.similar_images_feature,
                      function(item) {
                          return (typeof item.featureObject !== 'undefined');
                      });
                  var imgMatch = _.find(doc._source.hasImagePart,
                      function(part) {
                          return (part.uri === imgObj.featureObject.imageObjectUris[0]);
                      });
                  src = (imgMatch && imgMatch.cacheUrl) ? imgMatch.cacheUrl : src;
              }
          }
          /* jshint camelcase:true */

          return src;
      };

      $scope.$watch('selectedFolder._id',
          function(newValue, oldValue) {
              if(newValue && newValue !== oldValue) {
                $scope.retrieveFolder();
              } else {
                $scope.items = [];
                $scope.searchConfig.euiSearchIndex = '';
                $scope.filterFolder.enabled = false;
              }
          }
      );

      $scope.init();

    }]);