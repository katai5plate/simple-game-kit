import { $engine, XY, GameObject, GameEvent } from "./engine";

const player = new GameObject(
  "player",
  { position: new XY($engine.getCenterX(), $engine.getCenterY()) },
  (c, { position: { x, y } }) => {
    c.colorCode("blue");
    c.fillCircle(x, y, 30);
  }
);

$engine.addObjects([player]);

$engine.addEvents([
  new GameEvent("shot", "click", (e: MouseEvent) => {
    $engine.addObjects([
      new GameObject(
        "projectile" + Math.random(),
        {
          position: player.position,
          velocity: XY.parse(player.position).to($engine.getMousePosition()),
        },
        (c, { position: { x, y } }) => {
          c.colorCode("red");
          c.fillCircle(x, y, 5);
        }
      ),
    ]);
  }),
]);

globalThis.e = $engine;
