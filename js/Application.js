var users = {
'lijiangsheng1@gmail.com':'适兕',
'shake.chen@gmail.com':'chenshake',
'hzhan@eayun.com':'海洋的海',
'chuannai.lin@gmail.com':'lcn',
'deggs.k@gmail.com':'才疏学浅一码农',
'zhanghui9700@gmail.com':'pysharp',
'focusonit@163.com':'haohaohao',
'13681114606@139.com':'一棹凌烟',
'wakingdreamer@163.com':'WakingDreamer',
'fengli_csco@hotmail.com':'断水流',
'huangwenlong333@163.com':'文龙',
'allan_sun@yeah.net':'大龙',
'linux_zcy@163.com':'cyzhang',
'wendell_jing@163.com':'wendell',
'wangshiyao@cecgw.cn':'cecgwwsy',
'zhaoqiangx@gmail.com':'xkernel',
'jxwpx@163.com':'jxwpx',
'yanaimingvov@gmail.com':'严明',
'newbiezhang@126.com':'nba',
'liws163@163.com':'yuandianliws',
'longbocheng@sohu.com':'龙伯成',
'flwang@qq.com':'OpenStacker',
'zdhaimao@126.com':'海毛',
'cupdir@gmail.com':'Cupdir',
'stone1927@126.com':'jing',
'46564468@qq.com':'崇',
'commsea@gmail.com':'commsea',
'644986624@qq.com':'夏小苒',
'denghao@chinaunicom.cn':'haohao',
'itpx2001@139.com':'mahotma'
}

/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';

    var TodoItem = (function () {
        function TodoItem(title, completed) {
            this.title = title;
            this.completed = completed;
            var time= new Date();
            this.time = time.toLocaleTimeString();
            if (users[title] != undefined) {
                this.douban = true;
                this.nickname = users[title];
            }else{
                this.douban = false;
                this.notdouban = true;
            }
        }
        return TodoItem;
    })();
    todos.TodoItem = TodoItem;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';

    /**
    * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
    */
    function todoFocus($timeout) {
        return {
            link: function ($scope, element, attributes) {
                $scope.$watch(attributes.todoFocus, function (newval) {
                    if (newval) {
                        $timeout(function () {
                            return element[0].focus();
                        }, 0, false);
                    }
                });
            }
        };
    }
    todos.todoFocus = todoFocus;

    todoFocus.$inject = ['$timeout'];
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';

    /**
    * Directive that executes an expression when the element it is applied to loses focus.
    */
    function todoBlur() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('blur', function () {
                    $scope.$apply(attributes.todoBlur);
                });
            }
        };
    }
    todos.todoBlur = todoBlur;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';

    /**
    * Services that persists and retrieves TODOs from localStorage.
    */
    var TodoStorage = (function () {
        function TodoStorage() {
            this.STORAGE_ID = 'todos-angularjs-typescript';
        }
        TodoStorage.prototype.get = function () {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        };

        TodoStorage.prototype.put = function (todos) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        };
        return TodoStorage;
    })();
    todos.TodoStorage = TodoStorage;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';

    /**
    * The main controller for the app. The controller:
    * - retrieves and persists the model via the todoStorage service
    * - exposes the model to the template and provides event handlers
    */
    var TodoCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function TodoCtrl($scope, $location, todoStorage, filterFilter) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.todoStorage = todoStorage;
            this.filterFilter = filterFilter;
            this.todos = $scope.todos = todoStorage.get();

            $scope.newTodo = '';
            $scope.editedTodo = null;

            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;

            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            $scope.$watch('todos', function () {
                return _this.onTodos();
            }, true);
            $scope.$watch('location.path()', function (path) {
                return _this.onPath(path);
            });

            if ($location.path() === '')
                $location.path('/');
            $scope.location = $location;
        }
        TodoCtrl.prototype.onPath = function (path) {
            this.$scope.statusFilter = (path === '/active') ? { completed: false } : (path === '/completed') ? { completed: true } : null;
        };

        TodoCtrl.prototype.onTodos = function () {
            this.$scope.remainingCount = this.filterFilter(this.todos, { completed: false }).length;
            this.$scope.doneCount = this.todos.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount;
            this.todoStorage.put(this.todos);
        };

        TodoCtrl.prototype.addTodo = function () {
            if (!this.$scope.newTodo.length) {
                return;
            }

            this.todos.push(new todos.TodoItem(this.$scope.newTodo, true));
            this.$scope.newTodo = '';
        };

        TodoCtrl.prototype.editTodo = function (todoItem) {
            this.$scope.editedTodo = todoItem;
        };

        TodoCtrl.prototype.doneEditing = function (todoItem) {
            this.$scope.editedTodo = null;
            if (!todoItem.title) {
                this.removeTodo(todoItem);
            }
        };

        TodoCtrl.prototype.removeTodo = function (todoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        };

        TodoCtrl.prototype.clearDoneTodos = function () {
            this.$scope.todos = this.todos = this.todos.filter(function (todoItem) {
                return !todoItem.completed;
            });
        };

        TodoCtrl.prototype.markAll = function (completed) {
            this.todos.forEach(function (todoItem) {
                todoItem.completed = completed;
            });
        };
        TodoCtrl.$inject = [
            '$scope',
            '$location',
            'todoStorage',
            'filterFilter'
        ];
        return TodoCtrl;
    })();
    todos.TodoCtrl = TodoCtrl;
})(todos || (todos = {}));
/// <reference path='_all.ts' />
/**
* The main TodoMVC app module.
*
* @type {angular.Module}
*/
var todos;
(function (todos) {
    'use strict';

    var todomvc = angular.module('todomvc', []).controller('todoCtrl', todos.TodoCtrl).directive('todoBlur', todos.todoBlur).directive('todoFocus', todos.todoFocus).service('todoStorage', todos.TodoStorage);
})(todos || (todos = {}));
//# sourceMappingURL=Application.js.map

