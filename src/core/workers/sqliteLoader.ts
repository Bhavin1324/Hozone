const CACHE_NAME = 'hozone-offline-sqlite-v1.0.1';
const LEGACY_CACHE_NAMES = ['hozone-offline-sqlite-v1'];
const DB_ASSET_URL =
  (import.meta.env?.VITE_DATABASE_ASSET_URL as string) || '/data/hozone_core_v1.db.gz';
export const WASM_URL =
  (import.meta.env?.VITE_WASM_ASSET_URL as string) || '/data/sql-wasm.wasm';
const EXPECTED_UNCOMPRESSED_SIZE = 192073728;
const EXPECTED_COMPRESSED_SIZE = 30642884;

export type LoadProgressCallback = (
  status: 'downloading' | 'decompressing' | 'mounting' | 'ready',
  progressPercent: number
) => void;

export function isGzipBuffer(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 2) return false;
  const view = new Uint8Array(buffer, 0, 2);
  return view[0] === 0x1f && view[1] === 0x8b;
}

export function isSqliteBuffer(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 16) return false;
  const view = new Uint8Array(buffer, 0, 16);
  const header = String.fromCharCode(...view);
  return header.startsWith('SQLite format 3');
}

export async function decompressGzip(compressedBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(new Uint8Array(compressedBuffer));
  writer.close();

  const response = new Response(ds.readable);
  return response.arrayBuffer();
}

async function fetchWithProgress(url: string, onProgress: LoadProgressCallback): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download database asset: ${response.status} ${response.statusText}`);
  }

  const rawLengthHeader = Number(response.headers.get('content-length'));
  let totalExpected = rawLengthHeader > 0 ? rawLengthHeader : EXPECTED_COMPRESSED_SIZE;

  const reader = response.body?.getReader();
  if (!reader) {
    const buf = await response.arrayBuffer();
    onProgress('downloading', 100);
    return buf;
  }

  let receivedLength = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    // Adapt progress base if browser is transparently decompressing on the wire
    if (receivedLength > totalExpected) {
      totalExpected = EXPECTED_UNCOMPRESSED_SIZE;
    }

    const percent = Math.min(95, Math.round((receivedLength / totalExpected) * 100));
    onProgress('downloading', percent);
  }

  const allChunks = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, position);
    position += chunk.length;
  }

  onProgress('downloading', 100);
  return allChunks.buffer;
}

export async function loadOrDownloadDatabase(onProgress: LoadProgressCallback): Promise<ArrayBuffer> {
  let cache: Cache | null = null;
  try {
    if ('caches' in self) {
      for (const legacy of LEGACY_CACHE_NAMES) {
        if (await caches.has(legacy)) {
          await caches.delete(legacy);
        }
      }
      cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match('/data/hozone_core_v1.db');
      if (cachedResponse) {
        onProgress('mounting', 90);
        return await cachedResponse.arrayBuffer();
      }
    }
  } catch (err) {
    console.warn('[SqliteLoader] Cache API access failed, continuing direct download:', err);
  }

  // Download asset (wire may be compressed or transparently decompressed by browser)
  onProgress('downloading', 5);
  const downloadedBuffer = await fetchWithProgress(DB_ASSET_URL, onProgress);

  let rawDbBuffer: ArrayBuffer;

  if (isSqliteBuffer(downloadedBuffer)) {
    // Browser or proxy transparently decompressed during transfer (Content-Encoding: gzip)
    onProgress('decompressing', 90);
    rawDbBuffer = downloadedBuffer;
  } else if (isGzipBuffer(downloadedBuffer)) {
    // Raw GZIP archive stream: decompress via browser streaming API
    onProgress('decompressing', 85);
    try {
      rawDbBuffer = await decompressGzip(downloadedBuffer);
    } catch (decompError) {
      if (isSqliteBuffer(downloadedBuffer)) {
        rawDbBuffer = downloadedBuffer;
      } else {
        throw decompError;
      }
    }
  } else {
    // Defensive fallback: attempt decompression, fallback to buffer if SQLite
    try {
      onProgress('decompressing', 85);
      rawDbBuffer = await decompressGzip(downloadedBuffer);
    } catch {
      if (isSqliteBuffer(downloadedBuffer)) {
        rawDbBuffer = downloadedBuffer;
      } else {
        throw new Error('Downloaded database file is neither a valid GZIP archive nor a SQLite database.');
      }
    }
  }

  // Cache decompressed DB for immediate subsequent loads
  if (cache) {
    try {
      await cache.put(
        '/data/hozone_core_v1.db',
        new Response(rawDbBuffer, {
          headers: { 'Content-Type': 'application/x-sqlite3' },
        })
      );
    } catch (e) {
      console.warn('[SqliteLoader] Failed to write DB to Cache API:', e);
    }
  }

  return rawDbBuffer;
}

