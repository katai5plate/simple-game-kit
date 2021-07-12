export {};

declare global {
  interface CanvasRenderingContext2D {
    fillCircle(
      x: number,
      y: number,
      r: number,
      startAngle?: number,
      endAngle?: number,
      anticlockwise?: boolean
    ): void;
    strokeCircle(
      x: number,
      y: number,
      r: number,
      startAngle?: number,
      endAngle?: number,
      anticlockwise?: boolean
    ): void;
    color(r: number, g: number, b: number, a?: number): void;
    colorCode(code: string): void;
  }
}

const circle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  startAngle = 0,
  endAngle = 360,
  anticlockwise = false
) => {
  const [sa, ea] = [startAngle, endAngle].map((x) => (x * Math.PI) / 180);
  ctx.beginPath();
  ctx.arc(x, y, r, sa, ea, anticlockwise);
};

CanvasRenderingContext2D.prototype.fillCircle = function (
  x: number,
  y: number,
  r: number,
  startAngle = 0,
  endAngle = 360,
  anticlockwise = false
): void {
  const c = this as CanvasRenderingContext2D;
  circle(c, x, y, r, startAngle, endAngle, anticlockwise);
  c.fill();
};

CanvasRenderingContext2D.prototype.strokeCircle = function (
  x: number,
  y: number,
  r: number,
  startAngle = 0,
  endAngle = 360,
  anticlockwise = false
): void {
  const c = this as CanvasRenderingContext2D;
  circle(c, x, y, r, startAngle, endAngle, anticlockwise);
  c.fill();
};

CanvasRenderingContext2D.prototype.color = function (
  r: number,
  g: number,
  b: number,
  a = 1
): void {
  const c = this as CanvasRenderingContext2D;
  c.fillStyle = `rgba(${r},${g},${b},${a})`;
  c.strokeStyle = `rgba(${r},${g},${b},${a})`;
};

CanvasRenderingContext2D.prototype.colorCode = function (code: string): void {
  const c = this as CanvasRenderingContext2D;
  c.fillStyle = code;
  c.strokeStyle = code;
};
