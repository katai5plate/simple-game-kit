var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
define(["require", "exports", "./extensions/context"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameEvent = exports.GameObject = exports.Engine = exports.Rect = exports.XY = void 0;
    var XY = /** @class */ (function () {
        function XY(x, y) {
            var _this = this;
            this.to = function (target) {
                var angle = Math.atan2(target.y - _this.y, target.x - _this.x);
                return new XY(Math.cos(angle), Math.sin(angle));
            };
            this.x = x || 0;
            this.y = y || 0;
        }
        XY.parse = function (_a) {
            var x = _a.x, y = _a.y;
            return new XY(x, y);
        };
        return XY;
    }());
    exports.XY = XY;
    var Rect = /** @class */ (function () {
        function Rect(x, y, w, h) {
            var _this = this;
            this.hit = function (target) {
                return _this.x <= target.x &&
                    target.x <= _this.x + _this.w &&
                    _this.y <= target.y &&
                    target.y <= _this.y + _this.h;
            };
            this.x = x || 0;
            this.y = y || 0;
            this.w = w || 0;
            this.h = h || 0;
        }
        Rect.parse = function (_a) {
            var x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            return new Rect(x, y, w, h);
        };
        return Rect;
    }());
    exports.Rect = Rect;
    var Engine = /** @class */ (function () {
        function Engine(width, height) {
            var _this = this;
            this.getContext = function () { return _this.context; };
            this.getScreenRect = function () { return new Rect(0, 0, _this.canvas.width, _this.canvas.height); };
            this.getScreenSize = function () { return new XY(_this.canvas.width, _this.canvas.height); };
            this.getScreenWidth = function () { return _this.canvas.width; };
            this.getScreenHeight = function () { return _this.canvas.height; };
            this.getCenter = function () { return new XY(_this.canvas.width / 2, _this.canvas.height / 2); };
            this.getCenterX = function () { return _this.canvas.width / 2; };
            this.getCenterY = function () { return _this.canvas.height / 2; };
            this.getMousePosition = function () { return new XY(_this.mouse.x, _this.mouse.y); };
            this.getMouseX = function () { return _this.mouse.x; };
            this.getMouseY = function () { return _this.mouse.y; };
            this.animate = function () {
                requestAnimationFrame(_this.animate);
                if (_this.active) {
                    _this.context.clearRect(0, 0, _this.getScreenWidth(), _this.getScreenHeight());
                    _this.gameObjects.forEach(function (gameObject) {
                        gameObject.draw();
                    });
                }
            };
            if (globalThis.$engine)
                throw new Error("The game engine is already running!");
            this.canvas = document.getElementById("app");
            this.context = this.canvas.getContext("2d");
            this.mouse = new XY(0, 0);
            this.canvas.width = width || window.innerWidth;
            this.canvas.height = height || window.innerHeight;
            this.gameObjects = [];
            this.events = [];
            addEventListener("mousemove", function (e) {
                _this.mouse.x = e.clientX;
                _this.mouse.y = e.clientY;
            });
            this.active = true;
            addEventListener("focus", function () { return (_this.active = true); });
            addEventListener("blur", function () { return (_this.active = false); });
            this.animate();
            globalThis.$engine = this;
        }
        Engine.prototype.addObjects = function (list) {
            var _this = this;
            list.forEach(function (gameObject) {
                var duplicate = _this.gameObjects.find(function (go) { return go.id === gameObject.id; });
                if (duplicate) {
                    console.warn("GameObject overwritten:", gameObject.id);
                    _this.removeObjects([gameObject.id]);
                }
                gameObject.parent = _this;
                _this.gameObjects.push(gameObject);
            });
        };
        Engine.prototype.removeObjects = function (ids) {
            var _this = this;
            ids.forEach(function (id) {
                var index = _this.gameObjects.findIndex(function (gameObject) { return gameObject.id === id; });
                if (index >= 0) {
                    delete _this.gameObjects[index];
                    _this.gameObjects = _this.gameObjects.filter(Boolean);
                }
            });
        };
        Engine.prototype.addEvents = function (list) {
            var _this = this;
            list.forEach(function (event) {
                var id = event.id, type = event.type, listener = event.listener;
                var duplicate = _this.events.find(function (event) { return event.id === id; });
                if (duplicate) {
                    console.warn("Event overwritten:", id);
                    _this.removeEvents([id]);
                }
                addEventListener(type, listener);
                _this.events.push(event);
            });
        };
        Engine.prototype.removeEvents = function (ids) {
            var _this = this;
            ids.forEach(function (id) {
                var index = _this.events.findIndex(function (event) { return event.id === id; });
                if (index >= 0) {
                    var _a = _this.events[index], type = _a.type, listener = _a.listener;
                    removeEventListener(type, listener);
                    delete _this.events[index];
                    _this.events = _this.events.filter(Boolean);
                }
            });
        };
        return Engine;
    }());
    exports.Engine = Engine;
    var GameObject = /** @class */ (function () {
        function GameObject(id, data, scripts) {
            if (!globalThis.$engine)
                throw new Error("The engine is not running!");
            var engine = globalThis.$engine;
            var _a = data || {}, position = _a.position, velocity = _a.velocity, destroyWhenOver = _a.destroyWhenOver;
            this.id = id;
            this.position = position ? __assign({}, position) : new XY();
            this.velocity = velocity ? __assign({}, velocity) : new XY();
            this.scripts = scripts || (function () { });
            this.context = globalThis.$engine.getContext();
            this.parent = parent || globalThis.$engine;
            this.gameObjects = [];
            if (destroyWhenOver) {
                if (destroyWhenOver instanceof Rect) {
                    this.destroyWhenOver = destroyWhenOver;
                }
                else {
                    this.destroyWhenOver = engine.getScreenRect();
                }
            }
            else {
                this.destroyWhenOver = undefined;
            }
        }
        GameObject.prototype.draw = function () {
            __spreadArray([this], this.gameObjects).forEach(function (gameObject) {
                if (gameObject.velocity.x !== 0 && gameObject.velocity.y !== 0) {
                    gameObject.position.x += gameObject.velocity.x;
                    gameObject.position.y += gameObject.velocity.y;
                }
                if (gameObject.destroyWhenOver) {
                    var position = gameObject.position;
                    if (!gameObject.destroyWhenOver.hit(position)) {
                        gameObject.destroy();
                    }
                }
                gameObject.scripts(gameObject.context, gameObject);
            });
        };
        GameObject.prototype.destroy = function () {
            if (this.parent instanceof Engine) {
                return globalThis.$engine.removeObjects([this.id]);
            }
            return this.parent.removeObjects([this.id]);
        };
        GameObject.prototype.addObjects = function (list) {
            var _this = this;
            list.forEach(function (gameObject) {
                var duplicate = _this.gameObjects.find(function (go) { return go.id === gameObject.id; });
                if (duplicate) {
                    console.warn.apply(console, __spreadArray(["GameObject overwritten:",
                        gameObject.id], (_this.parent instanceof GameObject ? ["in", _this.parent.id] : [])));
                    _this.removeObjects([gameObject.id]);
                }
                gameObject.parent = _this;
                _this.gameObjects.push(gameObject);
            });
        };
        GameObject.prototype.removeObjects = function (ids) {
            var _this = this;
            ids.forEach(function (id) {
                var index = _this.gameObjects.findIndex(function (gameObject) { return gameObject.id === id; });
                if (index >= 0) {
                    delete _this.gameObjects[index];
                    _this.gameObjects = _this.gameObjects.filter(Boolean);
                }
            });
        };
        return GameObject;
    }());
    exports.GameObject = GameObject;
    var GameEvent = /** @class */ (function () {
        function GameEvent(id, type, listener) {
            this.id = id;
            this.type = type;
            this.listener = listener;
        }
        return GameEvent;
    }());
    exports.GameEvent = GameEvent;
});
