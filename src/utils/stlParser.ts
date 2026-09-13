/**
 * Client-side binary STL volume estimate.
 * Binary layout: 80-byte header + uint32 triangle count + 50 bytes/triangle
 * (12 bytes normal + 36 bytes verts + 2 bytes attribute).
 * Volume via summed signed tetrahedra from origin; take abs → mm³ → cm³.
 */

export interface StlParseResult {
  ok: true;
  triangleCount: number;
  volumeCm3: number;
  volumeMm3: number;
}

export interface StlParseError {
  ok: false;
  reason: 'ascii' | 'too-small' | 'truncated' | 'invalid';
  message: string;
}

export type StlParseOutcome = StlParseResult | StlParseError;

function isAsciiStl(buffer: ArrayBuffer): boolean {
  const head = new Uint8Array(buffer, 0, Math.min(80, buffer.byteLength));
  let text = '';
  for (let i = 0; i < head.length; i++) {
    const c = head[i];
    if (c === 0) break;
    text += String.fromCharCode(c);
  }
  const lower = text.toLowerCase().trimStart();
  return lower.startsWith('solid') && !looksLikeBinaryDespiteSolid(buffer);
}

/** Some binary STLs still start with "solid" — check declared triangle count vs size. */
function looksLikeBinaryDespiteSolid(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 84) return false;
  const view = new DataView(buffer);
  const triCount = view.getUint32(80, true);
  const expected = 84 + triCount * 50;
  // Allow small slack for trailing bytes
  return triCount > 0 && Math.abs(expected - buffer.byteLength) < 512;
}

export function parseBinaryStlVolume(buffer: ArrayBuffer): StlParseOutcome {
  if (buffer.byteLength < 84) {
    return {
      ok: false,
      reason: 'too-small',
      message: 'File is too small to be a valid binary STL. You can still submit with a file link.',
    };
  }

  if (isAsciiStl(buffer)) {
    return {
      ok: false,
      reason: 'ascii',
      message:
        'This looks like an ASCII STL. In-browser volume estimate supports binary STL only. Paste a Drive/Dropbox/WeTransfer link below and submit — we will quote manually.',
    };
  }

  try {
    const view = new DataView(buffer);
    const triangleCount = view.getUint32(80, true);
    const expectedMin = 84 + triangleCount * 50;

    if (triangleCount === 0 || expectedMin > buffer.byteLength + 50) {
      return {
        ok: false,
        reason: 'truncated',
        message:
          'Triangle count does not match file size. File may be corrupt or not binary STL. You can still submit with a file link.',
      };
    }

    let volumeMm3 = 0;
    let offset = 84;

    for (let i = 0; i < triangleCount; i++) {
      // Skip normal (3 floats)
      offset += 12;
      const ax = view.getFloat32(offset, true);
      const ay = view.getFloat32(offset + 4, true);
      const az = view.getFloat32(offset + 8, true);
      offset += 12;
      const bx = view.getFloat32(offset, true);
      const by = view.getFloat32(offset + 4, true);
      const bz = view.getFloat32(offset + 8, true);
      offset += 12;
      const cx = view.getFloat32(offset, true);
      const cy = view.getFloat32(offset + 4, true);
      const cz = view.getFloat32(offset + 8, true);
      offset += 12;
      // attribute byte count
      offset += 2;

      // Signed tetrahedron volume: (1/6) * a · (b × c)
      const crossX = by * cz - bz * cy;
      const crossY = bz * cx - bx * cz;
      const crossZ = bx * cy - by * cx;
      volumeMm3 += (ax * crossX + ay * crossY + az * crossZ) / 6;
    }

    const absMm3 = Math.abs(volumeMm3);
    const volumeCm3 = absMm3 / 1000;

    return {
      ok: true,
      triangleCount,
      volumeCm3,
      volumeMm3: absMm3,
    };
  } catch {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Could not parse this STL. You can still submit with a file link and notes.',
    };
  }
}

export async function parseStlFile(file: File): Promise<StlParseOutcome> {
  const buffer = await file.arrayBuffer();
  return parseBinaryStlVolume(buffer);
}
