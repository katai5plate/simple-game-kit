import { Engine, XY, GameObject, GameEvent } from "./engine";

const engine = new Engine();

const player = new GameObject(
  "player",
  { position: new XY(engine.getCenterX(), engine.getCenterY()) },
  (c, { position: { x, y } }) => {
    c.colorCode("blue");
    c.fillCircle(x, y, 30);
  }
);

const projectiles = new GameObject("projectiles");

const memory = ({ total, used }) => {
  const p = performance as any;
  return {
    total: p.memory.totalJSHeapSize - total,
    used: p.memory.usedJSHeapSize - used,
  };
};
const now = memory({ total: 0, used: 0 });

const monitor = new GameObject("monitor", null, (c) => {
  c.colorCode("black");
  c.fillText(JSON.stringify(memory(now)), 0, 50);
});

engine.addObjects([player, projectiles, monitor]);

engine.addEvents([
  new GameEvent("shot", "mousemove", (e: MouseEvent) => {
    projectiles.addObjects([
      new GameObject(
        Math.random(),
        {
          position: player.position,
          velocity: XY.parse(player.position).to(engine.getMousePosition()),
          destroyWhenOver: true,
        },
        (c, { position: { x, y } }) => {
          c.colorCode("red");
          c.fillCircle(x, y, 5);
        }
      ),
    ]);
  }),
]);
