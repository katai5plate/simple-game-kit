define(["require", "exports", "./engine"], function (require, exports, engine_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var player = new engine_1.GameObject("player", { position: new engine_1.XY(engine_1.$engine.getCenterX(), engine_1.$engine.getCenterY()) }, function (c, _a) {
        var _b = _a.position, x = _b.x, y = _b.y;
        c.colorCode("blue");
        c.fillCircle(x, y, 30);
    });
    engine_1.$engine.addObjects([player]);
    engine_1.$engine.addEvents([
        new engine_1.GameEvent("shot", "click", function (e) {
            engine_1.$engine.addObjects([
                new engine_1.GameObject("projectile" + Math.random(), {
                    position: player.position,
                    velocity: engine_1.XY.parse(player.position).to(engine_1.$engine.getMousePosition()),
                }, function (c, _a) {
                    var _b = _a.position, x = _b.x, y = _b.y;
                    c.colorCode("red");
                    c.fillCircle(x, y, 5);
                }),
            ]);
        }),
    ]);
    globalThis.e = engine_1.$engine;
});
