import {
  A4_WIDTH_PX,
  blockPageBounds,
  pageContentBounds,
} from "./canvas-layout";
import type { ManualBlock } from "./types";

export const SNAP_THRESHOLD_PX = 5;

export type SnapGuideLines = {
  page: number;
  /** خط عمودی (مختصات x) */
  x?: number;
  /** خط افقی (مختصات y) */
  y?: number;
};

function blockRect(b: ManualBlock) {
  return {
    x: b.x ?? 0,
    y: b.y ?? 0,
    w: b.width ?? 280,
    h: b.height ?? 72,
  };
}

type Bounds = ReturnType<typeof pageContentBounds>;

function collectXTargets(
  page: number,
  blockId: string,
  blocks: ManualBlock[],
  bounds: Bounds
): number[] {
  const targets = new Set<number>([
    bounds.minX,
    bounds.maxX,
    A4_WIDTH_PX / 2,
  ]);

  for (const b of blocks) {
    if ((b.page ?? 0) !== page || b.id === blockId) continue;
    const r = blockRect(b);
    targets.add(r.x);
    targets.add(r.x + r.w);
    targets.add(r.x + r.w / 2);
  }

  return [...targets];
}

function collectYTargets(
  page: number,
  blockId: string,
  blocks: ManualBlock[],
  bounds: Bounds
): number[] {
  const midContent = (bounds.minY + bounds.maxY) / 2;
  const targets = new Set<number>([
    bounds.minY,
    bounds.maxY,
    midContent,
  ]);

  for (const b of blocks) {
    if ((b.page ?? 0) !== page || b.id === blockId) continue;
    const r = blockRect(b);
    targets.add(r.y);
    targets.add(r.y + r.h);
    targets.add(r.y + r.h / 2);
  }

  return [...targets];
}

function snapAxis1D(
  origin: number,
  size: number,
  targets: number[],
  threshold: number
): { origin: number; guide?: number } {
  const left = origin;
  const right = origin + size;
  const center = origin + size / 2;

  let bestDist = threshold + 1;
  let bestOrigin = origin;
  let bestGuide: number | undefined;

  for (const t of targets) {
    const candidates = [
      { next: t, dist: Math.abs(left - t), guide: t },
      { next: t - size, dist: Math.abs(right - t), guide: t },
      { next: t - size / 2, dist: Math.abs(center - t), guide: t },
    ];
    for (const c of candidates) {
      if (c.dist <= threshold && c.dist < bestDist) {
        bestDist = c.dist;
        bestOrigin = c.next;
        bestGuide = c.guide;
      }
    }
  }

  return { origin: bestOrigin, guide: bestGuide };
}

export function computeBlockSnap(params: {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  blockId: string;
  blocks: ManualBlock[];
  threshold?: number;
}): { x: number; y: number; guides: SnapGuideLines[] } {
  const {
    x,
    y,
    width,
    height,
    page,
    blockId,
    blocks,
    threshold = SNAP_THRESHOLD_PX,
  } = params;

  const moving = blocks.find((b) => b.id === blockId);
  const bounds = moving
    ? blockPageBounds(moving, page)
    : pageContentBounds(page);

  const xSnap = snapAxis1D(
    x,
    width,
    collectXTargets(page, blockId, blocks, bounds),
    threshold
  );
  const ySnap = snapAxis1D(
    y,
    height,
    collectYTargets(page, blockId, blocks, bounds),
    threshold
  );

  const guide: SnapGuideLines = { page };
  if (xSnap.guide !== undefined) guide.x = xSnap.guide;
  if (ySnap.guide !== undefined) guide.y = ySnap.guide;

  const guides: SnapGuideLines[] =
    guide.x !== undefined || guide.y !== undefined ? [guide] : [];

  return {
    x: xSnap.origin,
    y: ySnap.origin,
    guides,
  };
}
