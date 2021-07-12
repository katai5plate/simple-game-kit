import "./extensions/context";

export class XY {
  public x: number;
  public y: number;
  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }
  static parse = ({ x, y }: { x?: number; y?: number }) => new XY(x, y);
  to = (target: XY) => {
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    return new XY(Math.cos(angle), Math.sin(angle));
  };
}

export class Rect {
  public x: number;
  public y: number;
  public w: number;
  public h: number;
  constructor(x?: number, y?: number, w?: number, h?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
  }
  static parse = ({
    x,
    y,
    w,
    h,
  }: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  }) => new Rect(x, y, w, h);
  hit = (target: XY) =>
    this.x <= target.x &&
    target.x <= this.x + this.w &&
    this.y <= target.y &&
    target.y <= this.y + this.h;
}

type Identifier = string | number;
type WindowEventMapTrigger = keyof WindowEventMap;

export class Engine {
  private canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  private mouse: XY;
  private gameObjects: GameObject[];
  private events: GameEvent[];
  private active: boolean;
  constructor(width?: number, height?: number) {
    if (globalThis.$engine)
      throw new Error("The game engine is already running!");
    this.canvas = document.getElementById("app") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.mouse = new XY(0, 0);
    this.canvas.width = width || window.innerWidth;
    this.canvas.height = height || window.innerHeight;
    this.gameObjects = [];
    this.events = [];
    addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    this.active = true;
    addEventListener("focus", () => (this.active = true));
    addEventListener("blur", () => (this.active = false));
    this.animate();
    globalThis.$engine = this;
  }
  getContext = () => this.context;
  getScreenRect = () => new Rect(0, 0, this.canvas.width, this.canvas.height);
  getScreenSize = () => new XY(this.canvas.width, this.canvas.height);
  getScreenWidth = () => this.canvas.width;
  getScreenHeight = () => this.canvas.height;
  getCenter = () => new XY(this.canvas.width / 2, this.canvas.height / 2);
  getCenterX = () => this.canvas.width / 2;
  getCenterY = () => this.canvas.height / 2;
  getMousePosition = () => new XY(this.mouse.x, this.mouse.y);
  getMouseX = () => this.mouse.x;
  getMouseY = () => this.mouse.y;
  addObjects(list: GameObject[]) {
    list.forEach((gameObject) => {
      const duplicate = this.gameObjects.find((go) => go.id === gameObject.id);
      if (duplicate) {
        console.warn("GameObject overwritten:", gameObject.id);
        this.removeObjects([gameObject.id]);
      }
      gameObject.parent = this;
      this.gameObjects.push(gameObject);
    });
  }
  removeObjects(ids: Identifier[]) {
    ids.forEach((id) => {
      const index = this.gameObjects.findIndex(
        (gameObject) => gameObject.id === id
      );
      if (index >= 0) {
        delete this.gameObjects[index];
        this.gameObjects = this.gameObjects.filter(Boolean);
      }
    });
  }
  addEvents(list: GameEvent[]) {
    list.forEach((event) => {
      const { id, type, listener } = event;
      const duplicate = this.events.find((event) => event.id === id);
      if (duplicate) {
        console.warn("Event overwritten:", id);
        this.removeEvents([id]);
      }
      addEventListener(type, listener);
      this.events.push(event);
    });
  }
  removeEvents(ids: Identifier[]) {
    ids.forEach((id) => {
      const index = this.events.findIndex((event) => event.id === id);
      if (index >= 0) {
        const { type, listener } = this.events[index];
        removeEventListener(type, listener);
        delete this.events[index];
        this.events = this.events.filter(Boolean);
      }
    });
  }
  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.active) {
      this.context.clearRect(
        0,
        0,
        this.getScreenWidth(),
        this.getScreenHeight()
      );
      this.gameObjects.forEach((gameObject) => {
        gameObject.draw();
      });
    }
  };
}

type GameObjectScripts = (
  ctx: CanvasRenderingContext2D,
  self: GameObject
) => void;

export class GameObject {
  public id: Identifier;
  public position: XY;
  public velocity: XY;
  private scripts: GameObjectScripts;
  private context: CanvasRenderingContext2D;
  public parent: Engine | GameObject;
  private gameObjects: GameObject[];
  private destroyWhenOver: Rect | undefined;
  constructor(
    id: Identifier,
    data?: {
      position?: XY;
      velocity?: XY;
      parent?: Engine | GameObject;
      destroyWhenOver?: Rect | boolean;
    },
    scripts?: GameObjectScripts
  ) {
    if (!globalThis.$engine) throw new Error("The engine is not running!");
    const engine = globalThis.$engine as Engine;
    const { position, velocity, destroyWhenOver } = data || {};
    this.id = id;
    this.position = position ? { ...position } : new XY();
    this.velocity = velocity ? { ...velocity } : new XY();
    this.scripts = scripts || (() => {});
    this.context = (globalThis.$engine as Engine).getContext();
    this.parent = parent || globalThis.$engine;
    this.gameObjects = [];
    if (destroyWhenOver) {
      if (destroyWhenOver instanceof Rect) {
        this.destroyWhenOver = destroyWhenOver;
      } else {
        this.destroyWhenOver = engine.getScreenRect();
      }
    } else {
      this.destroyWhenOver = undefined;
    }
  }
  draw() {
    [this, ...this.gameObjects].forEach((gameObject) => {
      if (gameObject.velocity.x !== 0 && gameObject.velocity.y !== 0) {
        gameObject.position.x += gameObject.velocity.x;
        gameObject.position.y += gameObject.velocity.y;
      }
      if (gameObject.destroyWhenOver) {
        const { position } = gameObject;
        if (!gameObject.destroyWhenOver.hit(position)) {
          gameObject.destroy();
        }
      }
      gameObject.scripts(gameObject.context, gameObject);
    });
  }
  destroy() {
    if (this.parent instanceof Engine) {
      return (globalThis.$engine as Engine).removeObjects([this.id]);
    }
    return this.parent.removeObjects([this.id]);
  }
  addObjects(list: GameObject[]) {
    list.forEach((gameObject) => {
      const duplicate = this.gameObjects.find((go) => go.id === gameObject.id);
      if (duplicate) {
        console.warn(
          "GameObject overwritten:",
          gameObject.id,
          ...(this.parent instanceof GameObject ? ["in", this.parent.id] : [])
        );
        this.removeObjects([gameObject.id]);
      }
      gameObject.parent = this;
      this.gameObjects.push(gameObject);
    });
  }
  removeObjects(ids: Identifier[]) {
    ids.forEach((id) => {
      const index = this.gameObjects.findIndex(
        (gameObject) => gameObject.id === id
      );
      if (index >= 0) {
        delete this.gameObjects[index];
        this.gameObjects = this.gameObjects.filter(Boolean);
      }
    });
  }
}

export class GameEvent {
  public id: Identifier;
  public type: WindowEventMapTrigger;
  public listener: (
    this: Window,
    ev: WindowEventMap[WindowEventMapTrigger]
  ) => any;
  constructor(
    id: Identifier,
    type: WindowEventMapTrigger,
    listener: (this: Window, ev: WindowEventMap[WindowEventMapTrigger]) => any
  ) {
    this.id = id;
    this.type = type;
    this.listener = listener;
  }
}
