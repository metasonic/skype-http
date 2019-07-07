
/* tslint:disable */
/* @ts-ignore */
// @ts-ignore
async function PackageSADataForProof(e) {
  let t; const o = []; let
    n = 0;
  for (t = 0; t < e.length; t++) {
    o[n++] = 127 & e.charCodeAt(t),
      o[n++] = (65280 & e.charCodeAt(t)) >> 8;
  }
  return o;
}

// @ts-ignore
async function mapByteToBase64(e) {
  return e >= 0 && e < 26 ? String.fromCharCode(65 + e) : e >= 26 && e < 52 ? String.fromCharCode(97 + e - 26) : e >= 52 && e < 62 ? String.fromCharCode(48 + e - 52) : e == 62 ? '+' : '/';
}
// @ts-ignore
async function base64Encode(e, t) {
  let o; let
    n = '';
  for (o = t; o < 4; o++) {
    e >>= 6;
  }
  for (o = 0; t > o; o++) {
    n = await mapByteToBase64(63 & e) + n,
      e >>= 6;
  }
  return n;
}
// @ts-ignore
async function byteArrayToBase64(e) {
  let t; let o; const n = e.length; let
    r = '';
  for (t = n - 3; t >= 0; t -= 3) {
    o = e[t] | e[t + 1] << 8 | e[t + 2] << 16,
      r += await base64Encode(o, 4);
  }
  const i = n % 3;
  for (o = 0,
         t += 2; t >= 0; t--) {
    o = o << 8 | e[t];
  }
  return i == 1 ? r = `${r + await base64Encode(o << 16, 2)}==` : i == 2 && (r = `${r + await base64Encode(o << 8, 3)}=`),
    r;
}
// @ts-ignore
async function parseRSAKeyFromString(e) {
  const t = e.indexOf(';');
  if (t < 0) {
    return null;
  }
  const o = e.substr(0, t);
  const n = e.substr(t + 1);
  let r = o.indexOf('=');
  if (r < 0) {
    return null;
  }
  const i = o.substr(r + 1);
  if (r = n.indexOf('='),
  r < 0) {
    return null;
  }
  const a = n.substr(r + 1);
  const l = new Object();
  // @ts-ignore
  return l.n = await hexStringToMP(a),
    // @ts-ignore
    l.e = parseInt(i, 16),
    l;
}
// @ts-ignore
async function RSAEncrypt(e, t, randomNum) {
  // @ts-ignore
  for (var o = [], n = 42, r = 2 * t.n.size - n, i = 0; i < e.length; i += r) {
    if (i + r >= e.length) {
      var a = await RSAEncryptBlock(e.slice(i), t, randomNum);
      // @ts-ignore
      a && (o = a.concat(o));
    } else {
      var a = await RSAEncryptBlock(e.slice(i, i + r), t, randomNum);
      // @ts-ignore
      a && (o = a.concat(o));
    }
  }
  // @ts-ignore
  const l = await byteArrayToBase64(o);
  return l;
}
// @ts-ignore
async function RSAEncryptBlock(e, t, o) {
  const { n } = t;
  const r = t.e;
  const i = e.length;
  const a = 2 * n.size;
  const l = 42;
  if (i + l > a) {
    return null;
  }
  await applyPKCSv2Padding(e, a, o),
    e = e.reverse();
  const s = await byteArrayToMP(e);
  const c = await modularExp(s, r, n);
  c.size = n.size;
  let f = await mpToByteArray(c);
  return f = f.reverse();
}

// @ts-ignore
async function duplicateMP(e) {
  // @ts-ignore
  const t = new JSMPnumber();
  return t.size = e.size,
    t.data = e.data.slice(0),
    t;
}
// @ts-ignore
async function byteArrayToMP(e) {
  // @ts-ignore
  const t = new JSMPnumber();
  let o = 0;
  const n = e.length;
  const r = n >> 1;
  for (o = 0; r > o; o++) {
    t.data[o] = e[2 * o] + (e[1 + 2 * o] << 8);
  }
  return n % 2 && (t.data[o++] = e[n - 1]),
    t.size = o,
    t;
}

// @ts-ignore
async function mpToByteArray(e) {
  const t = [];
  let o = 0;
  const n = e.size;
  for (o = 0; n > o; o++) {
    t[2 * o] = 255 & e.data[o];
    const r = e.data[o] >>> 8;
    t[2 * o + 1] = r;
  }
  return t;
}
// @ts-ignore
async function modularExp(e, t, o) {
  for (var n = [], r = 0; t > 0;) {
    n[r] = 1 & t,
      t >>>= 1,
      r++;
  }
  for (var i = await duplicateMP(e), a = r - 2; a >= 0; a--) {
    i = await modularMultiply(i, i, o),
    n[a] == 1 && (i = await modularMultiply(i, e, o));
  }
  return i;
}
// @ts-ignore
async function modularMultiply(e, t, o) {
  const n = await multiplyMP(e, t);
  const r = await divideMP(n, o);
  return r.r;
}
// @ts-ignore
async function multiplyMP(e, t) {
  // @ts-ignore
  const o = new JSMPnumber();
  o.size = e.size + t.size;
  let n; let
    r;
  for (n = 0; n < o.size; n++) {
    o.data[n] = 0;
  }
  const i = e.data;
  const a = t.data;
  const l = o.data;
  if (e == t) {
    for (n = 0; n < e.size; n++) {
      l[2 * n] += i[n] * i[n];
    }
    for (n = 1; n < e.size; n++) {
      for (r = 0; n > r; r++) {
        l[n + r] += 2 * i[n] * i[r];
      }
    }
  } else {
    for (n = 0; n < e.size; n++) {
      for (r = 0; r < t.size; r++) {
        l[n + r] += i[n] * a[r];
      }
    }
  }
  return normalizeJSMP(o),
    o;
}
// @ts-ignore
async function normalizeJSMP(e) {
  let t; let o; let n; let r; let
    i;
  for (n = e.size,
         o = 0,
         t = 0; n > t; t++) {
    r = e.data[t],
      r += o,
      i = r,
      o = Math.floor(r / 65536),
      r -= 65536 * o,
      e.data[t] = r;
  }
}
// @ts-ignore
async function removeLeadingZeroes(e) {
  for (let t = e.size - 1; t > 0 && e.data[t--] == 0;) {
    e.size--;
  }
}
// @ts-ignore
async function divideMP(e, t) {
  const o = e.size;
  const n = t.size;
  const r = t.data[n - 1];
  const i = t.data[n - 1] + t.data[n - 2] / 65536;
  // @ts-ignore
  const a = new JSMPnumber();
  a.size = o - n + 1,
    e.data[o] = 0;
  for (let l = o - 1; l >= n - 1; l--) {
    const s = l - n + 1;
    let c = Math.floor((65536 * e.data[l + 1] + e.data[l]) / i);
    if (c > 0) {
      let f = await multiplyAndSubtract(e, c, t, s);
      for (f < 0 && (c--,
        await multiplyAndSubtract(e, c, t, s)); f > 0 && e.data[l] >= r;) {
        f = await multiplyAndSubtract(e, 1, t, s),
        f > 0 && c++;
      }
    }
    a.data[s] = c;
  }
  await removeLeadingZeroes(e);
  const d = {
    q: a,
    r: e,
  };
  return d;
}
// @ts-ignore
async function multiplyAndSubtract(e, t, o, n) {
  let r; const i = e.data.slice(0); let a = 0; const
    l = e.data;
  for (r = 0; r < o.size; r++) {
    let s = a + o.data[r] * t;
    a = s >>> 16,
      s -= 65536 * a,
      s > l[r + n] ? (l[r + n] += 65536 - s,
        a++) : l[r + n] -= s;
  }
  return a > 0 && (l[r + n] -= a),
    l[r + n] < 0 ? (e.data = i.slice(0),
      -1) : 1;
}
// @ts-ignore
async function applyPKCSv2Padding(e, t, o) {
  let n; const r = e.length; const i = [218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]; const a = t - r - 40 - 2; const
    l = [];
  for (n = 0; a > n; n++) {
    l[n] = 0;
  }
  l[a] = 1;
  const s = i.concat(l, e);
  let c = [];
  for (n = 0; n < 20; n++) {
    c[n] = Math.floor(256 * Math.random());
  }
  c = await SHA1(c.concat(o));
  const f = await MGF(c, t - 21);
  const d = await XORarrays(s, f);
  const u = await MGF(d, 20);
  const p = await XORarrays(c, u);
  let v = [];
  for (v[0] = 0,
         // @ts-ignore
         v = v.concat(p, d),
         n = 0; n < v.length; n++) {
    e[n] = v[n];
  }
}
// @ts-ignore
async function MGF(e, t) {
  if (t > 4096) {
    return null;
  }
  const o = e.slice(0);
  let n = o.length;
  o[n++] = 0,
    o[n++] = 0,
    o[n++] = 0,
    o[n] = 0;
  // @ts-ignore
  for (var r = 0, i = []; i.length < t;) {
    o[n] = r++,
      // @ts-ignore
      i = i.concat(await SHA1(o));
  }
  return i.slice(0, t);
}
// @ts-ignore
async function XORarrays(e, t) {
  if (e.length != t.length) {
    return null;
  }
  for (var o = [], n = e.length, r = 0; n > r; r++) {
    o[r] = e[r] ^ t[r];
  }
  return o;
}
// @ts-ignore
async function SHA1(e) {
  let t; const
    o = e.slice(0);
  await PadSHA1Input(o);
  const n = {
    A: 1732584193,
    B: 4023233417,
    C: 2562383102,
    D: 271733878,
    E: 3285377520,
  };
  for (t = 0; t < o.length; t += 64) {
    await SHA1RoundFunction(n, o, t);
  }
  // @ts-ignore
  const r = [];
  // @ts-ignore
  return await wordToBytes(n.A, r, 0),
    // @ts-ignore
    await wordToBytes(n.B, r, 4),
    // @ts-ignore
    await wordToBytes(n.C, r, 8),
    // @ts-ignore
    await wordToBytes(n.D, r, 12),
    // @ts-ignore
    await wordToBytes(n.E, r, 16),
    // @ts-ignore
    r;
}
// @ts-ignore
async function wordToBytes(e, t, o) {
  let n;
  for (n = 3; n >= 0; n--) {
    t[o + n] = 255 & e,
      e >>>= 8;
  }
}
// @ts-ignore
async function PadSHA1Input(e) {
  let t; const o = e.length; let n = o; const r = o % 64; const
    i = r < 55 ? 56 : 120;
  for (e[n++] = 128,
         t = r + 1; i > t; t++) {
    e[n++] = 0;
  }
  let a = 8 * o;
  for (t = 1; t < 8; t++) {
    e[n + 8 - t] = 255 & a,
      a >>>= 8;
  }
}
// @ts-ignore
async function SHA1RoundFunction(e, t, o) {
  let n; let r; let i; const a = 1518500249; const l = 1859775393; const s = 2400959708;
  const c = 3395469782; const f = []; let d = e.A; let u = e.B; let p = e.C; let v = e.D; let
    m = e.E;
  for (r = 0,
         i = o; r < 16; r++,
         i += 4) {
    f[r] = t[i] << 24 | t[i + 1] << 16 | t[i + 2] << 8 | t[i + 3] << 0;
  }
  for (r = 16; r < 80; r++) {
    f[r] = await rotateLeft(f[r - 3] ^ f[r - 8] ^ f[r - 14] ^ f[r - 16], 1);
  }
  let g;
  for (n = 0; n < 20; n++) {
    g = await rotateLeft(d, 5) + (u & p | ~u & v) + m + f[n] + a & 4294967295,
      m = v,
      v = p,
      p = await rotateLeft(u, 30),
      u = d,
      d = g;
  }
  for (n = 20; n < 40; n++) {
    g = await rotateLeft(d, 5) + (u ^ p ^ v) + m + f[n] + l & 4294967295,
      m = v,
      v = p,
      p = await rotateLeft(u, 30),
      u = d,
      d = g;
  }
  for (n = 40; n < 60; n++) {
    g = await rotateLeft(d, 5) + (u & p | u & v | p & v) + m + f[n] + s & 4294967295,
      m = v,
      v = p,
      p = await rotateLeft(u, 30),
      u = d,
      d = g;
  }
  for (n = 60; n < 80; n++) {
    g = await rotateLeft(d, 5) + (u ^ p ^ v) + m + f[n] + c & 4294967295,
      m = v,
      v = p,
      p = await rotateLeft(u, 30),
      u = d,
      d = g;
  }
  e.A = e.A + d & 4294967295,
    e.B = e.B + u & 4294967295,
    e.C = e.C + p & 4294967295,
    e.D = e.D + v & 4294967295,
    e.E = e.E + m & 4294967295;
}
// @ts-ignore
async function rotateLeft(e, t) {
  const o = e >>> 32 - t;
  const n = (1 << 32 - t) - 1;
  const r = e & n;
  return r << t | o;
}

function JSMPnumber() {
  // @ts-ignore
  this.size = 1;
  // @ts-ignore
  this.data = [];
  // @ts-ignore
  this.data[0] = 0;
}

// @ts-ignore
async function hexStringToMP(e) {
  let t; let o; const
    n = Math.ceil(e.length / 4);
  // @ts-ignore
  const r = new JSMPnumber();
  for (r.size = n,
         t = 0; n > t; t++) {
    o = e.substr(4 * t, 4),
      r.data[n - 1 - t] = parseInt(o, 16);
  }
  return r;
}

export async function getEncryptedCode(userCode: string, encryptionKey: string, randomNum: string) {
  const r = await PackageSADataForProof(userCode);
  const i = await parseRSAKeyFromString(encryptionKey);
  return await RSAEncrypt(r, i, randomNum);
}
