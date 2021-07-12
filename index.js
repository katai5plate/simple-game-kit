define(["require", "exports", "./engine"], function (require, exports, engine_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var engine = new engine_1.Engine();
    var player = new engine_1.GameObject("player", { position: new engine_1.XY(engine.getCenterX(), engine.getCenterY()) }, function (c, _a) {
        var _b = _a.position, x = _b.x, y = _b.y;
        c.colorCode("blue");
        c.fillCircle(x, y, 30);
    });
    engine.addObjects([player]);
    engine.addEvents([
        new engine_1.GameEvent("shot", "click", function (e) {
            engine.addObjects([
                new engine_1.GameObject("projectile" + Math.random(), {
                    position: player.position,
                    velocity: engine_1.XY.parse(player.position).to(engine.getMousePosition()),
                }, function (c, _a) {
                    var _b = _a.position, x = _b.x, y = _b.y;
                    c.colorCode("red");
                    c.fillCircle(x, y, 5);
                }),
            ]);
        }),
    ]);
});
