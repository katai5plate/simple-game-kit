define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var circle = function (ctx, x, y, r, startAngle, endAngle, anticlockwise) {
        if (startAngle === void 0) { startAngle = 0; }
        if (endAngle === void 0) { endAngle = 360; }
        if (anticlockwise === void 0) { anticlockwise = false; }
        var _a = [startAngle, endAngle].map(function (x) { return (x * Math.PI) / 180; }), sa = _a[0], ea = _a[1];
        ctx.beginPath();
        ctx.arc(x, y, r, sa, ea, anticlockwise);
    };
    CanvasRenderingContext2D.prototype.fillCircle = function (x, y, r, startAngle, endAngle, anticlockwise) {
        if (startAngle === void 0) { startAngle = 0; }
        if (endAngle === void 0) { endAngle = 360; }
        if (anticlockwise === void 0) { anticlockwise = false; }
        var c = this;
        circle(c, x, y, r, startAngle, endAngle, anticlockwise);
        c.fill();
    };
    CanvasRenderingContext2D.prototype.strokeCircle = function (x, y, r, startAngle, endAngle, anticlockwise) {
        if (startAngle === void 0) { startAngle = 0; }
        if (endAngle === void 0) { endAngle = 360; }
        if (anticlockwise === void 0) { anticlockwise = false; }
        var c = this;
        circle(c, x, y, r, startAngle, endAngle, anticlockwise);
        c.fill();
    };
    CanvasRenderingContext2D.prototype.color = function (r, g, b, a) {
        if (a === void 0) { a = 1; }
        var c = this;
        c.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        c.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };
    CanvasRenderingContext2D.prototype.colorCode = function (code) {
        var c = this;
        c.fillStyle = code;
        c.strokeStyle = code;
    };
});
