(function () {
  'use strict';


  angular
    .module('app', ['ui.router'])

    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/list');
      $stateProvider
        .state('list', {
          cache: false,
          url: '/list',
          templateUrl: 'partial-list-items.html'
        })

        .state('add', {
          cache: false,
          url: '/list/add',
          templateUrl: 'partial-add-item.html'
        })

        .state('edit', {
          cache: false,
          url: '/list/edit/:partyID',
          templateUrl: 'partial-add-item.html'
        })


    })
    .service('store', function ($stateParams) {
      this.todos = null;

      this.getTodos = function () {
        if (this.todos) {
          return this.todos;
        } else {
          this.todos = JSON.parse(localStorage.getItem('todos'));
          return this.todos ? this.todos : this.build();
        }
      };

      this.savetoStorage = function (arr, data) {
        localStorage.setItem(arr, JSON.stringify(data));
      };

      this.addTodo = function (todoText) {

        var saved = this.getTodos();

        saved.push({
          text: todoText,
          id: Math.random() * 6
        });
        this.savetoStorage('todos', saved)

      };

      this.removeTodo = function (index) {
        var saved = this.getTodos();
        this.todos.splice(index, 1);
        this.savetoStorage('todos', saved)
      };


      this.editItem = function (text, id) {
        var saved = this.getTodos();

        var elemId = this.findElem(saved, id);
        elemId.text = text;

        this.savetoStorage('todos', saved);

      };

      this.findElem = function (saved, id) {

        return saved.find(function (item) {
            return item.id === id;
          }
        );

      };
      this.build = function () {

        this.todos = [];
        this.addTodo('Some Item');
        this.addTodo('Another Item');

        return this.todos;
      }

    })

    .controller('AppController', function ($scope, $window, $state, store, $stateParams) {

      $scope.todos = store.getTodos();


      $scope.addOrEdit = function (text) {
        if ($stateParams.partyID) {
          store.editItem(text, Number($stateParams.partyID));

        } else {
          store.addTodo(text);

        }
        $state.go('list', null, {reload: true});

      };
      $scope.removeItem = function (index) {
        store.removeTodo(index);
      };


    })
    .directive('newItemForm', function ($window) {
      return {
        restrict: 'E',
        scope: {'submit': '&onSubmit'},
        templateUrl: 'new-item-form.html'

      };
    })
    .directive('listItemTable', function ($window) {
      return {
        restrict: 'E',
        scope: {'todos': '=doAttr', 'remove': '&onRemove'},
        templateUrl: 'list-item-table.html'

      };
    })


})();
