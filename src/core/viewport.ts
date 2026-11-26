import {WORLD} from '../content/balance.js';

interface ViewportRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Canvas object-fit: contain, including any letterbox offsets. */
export function screenToWorld(x:number, y:number, rect:ViewportRect) {
  const scale = Math.min(rect.width / WORLD.width, rect.height / WORLD.height);
  if (!Number.isFinite(scale) || scale <= 0) return null;
  const left = rect.left + (rect.width - WORLD.width * scale) / 2;
  const top = rect.top + (rect.height - WORLD.height * scale) / 2;
  return {x:(x-left)/scale, y:(y-top)/scale};
}
