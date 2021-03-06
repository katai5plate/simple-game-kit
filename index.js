define(["require", "exports", "./engine"], function (require, exports, engine_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var engine = new engine_1.Engine();
    var player = new engine_1.GameObject("player", { position: new engine_1.XY(engine.getCenterX(), engine.getCenterY()) }, function (c, _a) {
        var _b = _a.position, x = _b.x, y = _b.y;
        c.colorCode("blue");
        c.fillCircle(x, y, 30);
    });
    var projectiles = new engine_1.GameObject("projectiles");
    var memory = function (_a) {
        var total = _a.total, used = _a.used;
        var p = performance;
        return {
            total: p.memory.totalJSHeapSize - total,
            used: p.memory.usedJSHeapSize - used,
        };
    };
    var now = memory({ total: 0, used: 0 });
    var monitor = new engine_1.GameObject("monitor", null, function (c) {
        c.colorCode("black");
        c.fillText(JSON.stringify([engine.getFps(), memory(now), engine.getFrameCount()]), 0, 50);
    });
    engine.addObjects([player, projectiles, monitor]);
    engine.addEvents([
        new engine_1.GameEvent("shot", "mousemove", function (e) {
            projectiles.addObjects([
                new engine_1.GameObject(Math.random(), {
                    position: player.position,
                    velocity: engine_1.XY.parse(player.position).to(engine.getMousePosition()),
                    destroyWhenOver: true,
                }, function (c, _a) {
                    var _b = _a.position, x = _b.x, y = _b.y;
                    c.colorCode("red");
                    c.fillCircle(x, y, 5);
                }),
            ]);
        }),
    ]);
});
