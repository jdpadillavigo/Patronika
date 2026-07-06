import Colors from '../Colors';

function parseGridData(gridData) {
  if (!gridData) return null;
  if (Array.isArray(gridData)) return gridData;

  try {
    const parsed = JSON.parse(gridData);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeHex(value) {
  if (typeof value !== 'string') return Colors.fixedWhite;
  const hex = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toUpperCase();
  return Colors.fixedWhite;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  return [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ];
}

function writeUint32(bytes, value) {
  bytes.push((value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255);
}

function writeChunk(bytes, type, data, crcTable) {
  writeUint32(bytes, data.length);

  const typeBytes = [...type].map(char => char.charCodeAt(0));
  for (const byte of typeBytes) {
    bytes.push(byte);
  }
  for (let i = 0; i < data.length; i += 1) {
    bytes.push(data[i]);
  }

  let crc = 0xffffffff;
  for (const byte of typeBytes) {
    crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  }
  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  }
  writeUint32(bytes, (crc ^ 0xffffffff) >>> 0);
}

function createCrcTable() {
  const table = [];
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
}

function adler32(data) {
  let a = 1;
  let b = 0;
  for (const byte of data) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function zlibStore(data) {
  const result = [0x78, 0x01];
  let offset = 0;

  while (offset < data.length) {
    const blockLength = Math.min(65535, data.length - offset);
    const isLast = offset + blockLength >= data.length;

    result.push(isLast ? 1 : 0);
    result.push(blockLength & 255, (blockLength >>> 8) & 255);
    const inverse = (~blockLength) & 0xffff;
    result.push(inverse & 255, (inverse >>> 8) & 255);

    for (let i = 0; i < blockLength; i += 1) {
      result.push(data[offset + i]);
    }

    offset += blockLength;
  }

  writeUint32(result, adler32(data));
  return result;
}

function bytesToBase64(bytes) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const chunks = [];

  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1];
    const c = bytes[i + 2];

    chunks.push(
      alphabet[a >> 2],
      alphabet[((a & 3) << 4) | ((b ?? 0) >> 4)],
      b === undefined ? '=' : alphabet[((b & 15) << 2) | ((c ?? 0) >> 6)],
      c === undefined ? '=' : alphabet[c & 63],
    );
  }

  return chunks.join('');
}

function createPngDataUri(grid, cellSize) {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const width = cols * cellSize;
  const height = rows * cellSize;
  const raw = [];

  for (let y = 0; y < height; y += 1) {
    raw.push(0);
    const sourceRow = grid[Math.floor(y / cellSize)] || [];
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = hexToRgb(sourceRow[Math.floor(x / cellSize)]);
      raw.push(r, g, b, 255);
    }
  }

  const bytes = [137, 80, 78, 71, 13, 10, 26, 10];
  const crcTable = createCrcTable();
  const ihdr = [];
  writeUint32(ihdr, width);
  writeUint32(ihdr, height);
  ihdr.push(8, 6, 0, 0, 0);

  writeChunk(bytes, 'IHDR', ihdr, crcTable);
  writeChunk(bytes, 'IDAT', zlibStore(raw), crcTable);
  writeChunk(bytes, 'IEND', [], crcTable);

  return `data:image/png;base64,${bytesToBase64(bytes)}`;
}

const _cache = new Map();

export function gridDataToImageUri(gridData, options = {}) {
  if (!gridData) return null;

  const maxDimension = options.maxDimension || 512;
  const cellSize = options.cellSize || 0;
  const cacheKey = `${typeof gridData === 'string' ? gridData : JSON.stringify(gridData)}|${maxDimension}|${cellSize}`;

  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  const grid = parseGridData(gridData);
  if (!grid?.length || !Array.isArray(grid[0]) || grid[0].length === 0) return null;

  const largestSide = Math.max(grid.length, grid[0].length);
  const resolvedCellSize = cellSize || Math.max(1, Math.floor(maxDimension / largestSide));

  const uri = createPngDataUri(grid, resolvedCellSize);
  _cache.set(cacheKey, uri);
  return uri;
}
