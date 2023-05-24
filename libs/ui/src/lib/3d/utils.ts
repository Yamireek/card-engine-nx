export function translate(x: number, y: number, z: number) {
  return `translate3d(${x}px, ${y}px, ${z}px)`;
}

export function rotate(x: number, y: number, z: number) {
  return `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
}

export function rotateX(x: number) {
  return `rotateX(${x}deg)`;
}

export function rotateY(x: number) {
  return `rotateY(${x}deg)`;
}

export function rotateZ(x: number) {
  return `rotateZ(${x}deg)`;
}

export function translateZ(x: number) {
  return `translateZ(${x}px)`;
}

export function transform(...items: string[]) {
  return items.join(" ");
}

export function scale(amount: number) {
  return `scale(${amount})`;
}
