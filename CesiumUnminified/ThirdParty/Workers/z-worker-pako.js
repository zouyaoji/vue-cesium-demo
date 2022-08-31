/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

!function() {
  "use strict";
  const { Array: e, Object: t, Math: n, Error: s, Uint8Array: r, Uint16Array: a, Uint32Array: i, Int32Array: o, DataView: c, Promise: l, TextEncoder: h, crypto: u, postMessage: p, TransformStream: f, ReadableStream: d, WritableStream: g, CompressionStream: w, DecompressionStream: y } = globalThis, _ = [];
  for (let e2 = 0; 256 > e2; e2++) {
    let t2 = e2;
    for (let e3 = 0; 8 > e3; e3++)
      1 & t2 ? t2 = t2 >>> 1 ^ 3988292384 : t2 >>>= 1;
    _[e2] = t2;
  }
  class m {
    constructor(e2) {
      this.crc = e2 || -1;
    }
    append(e2) {
      let t2 = 0 | this.crc;
      for (let n2 = 0, s2 = 0 | e2.length; s2 > n2; n2++)
        t2 = t2 >>> 8 ^ _[255 & (t2 ^ e2[n2])];
      this.crc = t2;
    }
    get() {
      return ~this.crc;
    }
  }
  class b extends f {
    constructor() {
      super({ start() {
        this.crc32 = new m();
      }, transform(e2) {
        this.crc32.append(e2);
      }, flush(e2) {
        const t2 = new r(4);
        new c(t2.buffer).setUint32(0, this.crc32.get()), e2.enqueue(t2);
      } });
    }
  }
  const k = { concat(e2, t2) {
    if (0 === e2.length || 0 === t2.length)
      return e2.concat(t2);
    const n2 = e2[e2.length - 1], s2 = k.getPartial(n2);
    return 32 === s2 ? e2.concat(t2) : k._shiftRight(t2, s2, 0 | n2, e2.slice(0, e2.length - 1));
  }, bitLength(e2) {
    const t2 = e2.length;
    if (0 === t2)
      return 0;
    const n2 = e2[t2 - 1];
    return 32 * (t2 - 1) + k.getPartial(n2);
  }, clamp(e2, t2) {
    if (32 * e2.length < t2)
      return e2;
    const s2 = (e2 = e2.slice(0, n.ceil(t2 / 32))).length;
    return t2 &= 31, s2 > 0 && t2 && (e2[s2 - 1] = k.partial(t2, e2[s2 - 1] & 2147483648 >> t2 - 1, 1)), e2;
  }, partial: (e2, t2, n2) => 32 === e2 ? t2 : (n2 ? 0 | t2 : t2 << 32 - e2) + 1099511627776 * e2, getPartial: (e2) => n.round(e2 / 1099511627776) || 32, _shiftRight(e2, t2, n2, s2) {
    for (void 0 === s2 && (s2 = []); t2 >= 32; t2 -= 32)
      s2.push(n2), n2 = 0;
    if (0 === t2)
      return s2.concat(e2);
    for (let r3 = 0; r3 < e2.length; r3++)
      s2.push(n2 | e2[r3] >>> t2), n2 = e2[r3] << 32 - t2;
    const r2 = e2.length ? e2[e2.length - 1] : 0, a2 = k.getPartial(r2);
    return s2.push(k.partial(t2 + a2 & 31, t2 + a2 > 32 ? n2 : s2.pop(), 1)), s2;
  } }, v = { bytes: { fromBits(e2) {
    const t2 = k.bitLength(e2) / 8, n2 = new r(t2);
    let s2;
    for (let r2 = 0; t2 > r2; r2++)
      0 == (3 & r2) && (s2 = e2[r2 / 4]), n2[r2] = s2 >>> 24, s2 <<= 8;
    return n2;
  }, toBits(e2) {
    const t2 = [];
    let n2, s2 = 0;
    for (n2 = 0; n2 < e2.length; n2++)
      s2 = s2 << 8 | e2[n2], 3 == (3 & n2) && (t2.push(s2), s2 = 0);
    return 3 & n2 && t2.push(k.partial(8 * (3 & n2), s2)), t2;
  } } }, S = { sha1: function(e2) {
    e2 ? (this._h = e2._h.slice(0), this._buffer = e2._buffer.slice(0), this._length = e2._length) : this.reset();
  } };
  S.sha1.prototype = { blockSize: 512, reset() {
    const e2 = this;
    return e2._h = this._init.slice(0), e2._buffer = [], e2._length = 0, e2;
  }, update(e2) {
    const t2 = this;
    "string" == typeof e2 && (e2 = v.utf8String.toBits(e2));
    const n2 = t2._buffer = k.concat(t2._buffer, e2), r2 = t2._length, a2 = t2._length = r2 + k.bitLength(e2);
    if (a2 > 9007199254740991)
      throw new s("Cannot hash more than 2^53 - 1 bits");
    const o2 = new i(n2);
    let c2 = 0;
    for (let e3 = t2.blockSize + r2 - (t2.blockSize + r2 & t2.blockSize - 1); a2 >= e3; e3 += t2.blockSize)
      t2._block(o2.subarray(16 * c2, 16 * (c2 + 1))), c2 += 1;
    return n2.splice(0, 16 * c2), t2;
  }, finalize() {
    const e2 = this;
    let t2 = e2._buffer;
    const s2 = e2._h;
    t2 = k.concat(t2, [k.partial(1, 1)]);
    for (let e3 = t2.length + 2; 15 & e3; e3++)
      t2.push(0);
    for (t2.push(n.floor(e2._length / 4294967296)), t2.push(0 | e2._length); t2.length; )
      e2._block(t2.splice(0, 16));
    return e2.reset(), s2;
  }, _init: [1732584193, 4023233417, 2562383102, 271733878, 3285377520], _key: [1518500249, 1859775393, 2400959708, 3395469782], _f: (e2, t2, n2, s2) => e2 > 19 ? e2 > 39 ? e2 > 59 ? e2 > 79 ? void 0 : t2 ^ n2 ^ s2 : t2 & n2 | t2 & s2 | n2 & s2 : t2 ^ n2 ^ s2 : t2 & n2 | ~t2 & s2, _S: (e2, t2) => t2 << e2 | t2 >>> 32 - e2, _block(t2) {
    const s2 = this, r2 = s2._h, a2 = e(80);
    for (let e2 = 0; 16 > e2; e2++)
      a2[e2] = t2[e2];
    let i2 = r2[0], o2 = r2[1], c2 = r2[2], l2 = r2[3], h2 = r2[4];
    for (let e2 = 0; 79 >= e2; e2++) {
      16 > e2 || (a2[e2] = s2._S(1, a2[e2 - 3] ^ a2[e2 - 8] ^ a2[e2 - 14] ^ a2[e2 - 16]));
      const t3 = s2._S(5, i2) + s2._f(e2, o2, c2, l2) + h2 + a2[e2] + s2._key[n.floor(e2 / 20)] | 0;
      h2 = l2, l2 = c2, c2 = s2._S(30, o2), o2 = i2, i2 = t3;
    }
    r2[0] = r2[0] + i2 | 0, r2[1] = r2[1] + o2 | 0, r2[2] = r2[2] + c2 | 0, r2[3] = r2[3] + l2 | 0, r2[4] = r2[4] + h2 | 0;
  } };
  const z = { getRandomValues(e2) {
    const t2 = new i(e2.buffer), s2 = (e3) => {
      let t3 = 987654321;
      const s3 = 4294967295;
      return () => (t3 = 36969 * (65535 & t3) + (t3 >> 16) & s3, (((t3 << 16) + (e3 = 18e3 * (65535 & e3) + (e3 >> 16) & s3) & s3) / 4294967296 + 0.5) * (n.random() > 0.5 ? 1 : -1));
    };
    for (let r2, a2 = 0; a2 < e2.length; a2 += 4) {
      const e3 = s2(4294967296 * (r2 || n.random()));
      r2 = 987654071 * e3(), t2[a2 / 4] = 4294967296 * e3() | 0;
    }
    return e2;
  } }, T = { importKey: (e2) => new T.hmacSha1(v.bytes.toBits(e2)), pbkdf2(e2, t2, n2, r2) {
    if (n2 = n2 || 1e4, 0 > r2 || 0 > n2)
      throw new s("invalid params to pbkdf2");
    const a2 = 1 + (r2 >> 5) << 2;
    let i2, o2, l2, h2, u2;
    const p2 = new ArrayBuffer(a2), f2 = new c(p2);
    let d2 = 0;
    const g2 = k;
    for (t2 = v.bytes.toBits(t2), u2 = 1; (a2 || 1) > d2; u2++) {
      for (i2 = o2 = e2.encrypt(g2.concat(t2, [u2])), l2 = 1; n2 > l2; l2++)
        for (o2 = e2.encrypt(o2), h2 = 0; h2 < o2.length; h2++)
          i2[h2] ^= o2[h2];
      for (l2 = 0; (a2 || 1) > d2 && l2 < i2.length; l2++)
        f2.setInt32(d2, i2[l2]), d2 += 4;
    }
    return p2.slice(0, r2 / 8);
  }, hmacSha1: class {
    constructor(e2) {
      const t2 = this, n2 = t2._hash = S.sha1, s2 = [[], []], r2 = n2.prototype.blockSize / 32;
      t2._baseHash = [new n2(), new n2()], e2.length > r2 && (e2 = n2.hash(e2));
      for (let t3 = 0; r2 > t3; t3++)
        s2[0][t3] = 909522486 ^ e2[t3], s2[1][t3] = 1549556828 ^ e2[t3];
      t2._baseHash[0].update(s2[0]), t2._baseHash[1].update(s2[1]), t2._resultHash = new n2(t2._baseHash[0]);
    }
    reset() {
      const e2 = this;
      e2._resultHash = new e2._hash(e2._baseHash[0]), e2._updated = false;
    }
    update(e2) {
      this._updated = true, this._resultHash.update(e2);
    }
    digest() {
      const e2 = this, t2 = e2._resultHash.finalize(), n2 = new e2._hash(e2._baseHash[1]).update(t2).finalize();
      return e2.reset(), n2;
    }
    encrypt(e2) {
      if (this._updated)
        throw new s("encrypt on already updated hmac called!");
      return this.update(e2), this.digest(e2);
    }
  } }, C = "Invalid password", D = 16, R = { name: "PBKDF2" }, I = t.assign({ hash: { name: "HMAC" } }, R), V = t.assign({ iterations: 1e3, hash: { name: "SHA-1" } }, R), q = ["deriveBits"], A = [8, 12, 16], B = [16, 24, 32], H = 10, K = [0, 0, 0, 0], x = "undefined", W = "function", P = typeof u != x, U = P && typeof u.subtle != x, E = P && typeof u.getRandomValues == W, M = P && U && typeof u.subtle.importKey == W, L = P && U && typeof u.subtle.deriveBits == W, j = v.bytes, F = class {
    constructor(e2) {
      const t2 = this;
      t2._tables = [[[], [], [], [], []], [[], [], [], [], []]], t2._tables[0][0][0] || t2._precompute();
      const n2 = t2._tables[0][4], r2 = t2._tables[1], a2 = e2.length;
      let i2, o2, c2, l2 = 1;
      if (4 !== a2 && 6 !== a2 && 8 !== a2)
        throw new s("invalid aes key size");
      for (t2._key = [o2 = e2.slice(0), c2 = []], i2 = a2; 4 * a2 + 28 > i2; i2++) {
        let e3 = o2[i2 - 1];
        (i2 % a2 == 0 || 8 === a2 && i2 % a2 == 4) && (e3 = n2[e3 >>> 24] << 24 ^ n2[e3 >> 16 & 255] << 16 ^ n2[e3 >> 8 & 255] << 8 ^ n2[255 & e3], i2 % a2 == 0 && (e3 = e3 << 8 ^ e3 >>> 24 ^ l2 << 24, l2 = l2 << 1 ^ 283 * (l2 >> 7))), o2[i2] = o2[i2 - a2] ^ e3;
      }
      for (let e3 = 0; i2; e3++, i2--) {
        const t3 = o2[3 & e3 ? i2 : i2 - 4];
        c2[e3] = 4 >= i2 || 4 > e3 ? t3 : r2[0][n2[t3 >>> 24]] ^ r2[1][n2[t3 >> 16 & 255]] ^ r2[2][n2[t3 >> 8 & 255]] ^ r2[3][n2[255 & t3]];
      }
    }
    encrypt(e2) {
      return this._crypt(e2, 0);
    }
    decrypt(e2) {
      return this._crypt(e2, 1);
    }
    _precompute() {
      const e2 = this._tables[0], t2 = this._tables[1], n2 = e2[4], s2 = t2[4], r2 = [], a2 = [];
      let i2, o2, c2, l2;
      for (let e3 = 0; 256 > e3; e3++)
        a2[(r2[e3] = e3 << 1 ^ 283 * (e3 >> 7)) ^ e3] = e3;
      for (let h2 = i2 = 0; !n2[h2]; h2 ^= o2 || 1, i2 = a2[i2] || 1) {
        let a3 = i2 ^ i2 << 1 ^ i2 << 2 ^ i2 << 3 ^ i2 << 4;
        a3 = a3 >> 8 ^ 255 & a3 ^ 99, n2[h2] = a3, s2[a3] = h2, l2 = r2[c2 = r2[o2 = r2[h2]]];
        let u2 = 16843009 * l2 ^ 65537 * c2 ^ 257 * o2 ^ 16843008 * h2, p2 = 257 * r2[a3] ^ 16843008 * a3;
        for (let n3 = 0; 4 > n3; n3++)
          e2[n3][h2] = p2 = p2 << 24 ^ p2 >>> 8, t2[n3][a3] = u2 = u2 << 24 ^ u2 >>> 8;
      }
      for (let n3 = 0; 5 > n3; n3++)
        e2[n3] = e2[n3].slice(0), t2[n3] = t2[n3].slice(0);
    }
    _crypt(e2, t2) {
      if (4 !== e2.length)
        throw new s("invalid aes block size");
      const n2 = this._key[t2], r2 = n2.length / 4 - 2, a2 = [0, 0, 0, 0], i2 = this._tables[t2], o2 = i2[0], c2 = i2[1], l2 = i2[2], h2 = i2[3], u2 = i2[4];
      let p2, f2, d2, g2 = e2[0] ^ n2[0], w2 = e2[t2 ? 3 : 1] ^ n2[1], y2 = e2[2] ^ n2[2], _2 = e2[t2 ? 1 : 3] ^ n2[3], m2 = 4;
      for (let e3 = 0; r2 > e3; e3++)
        p2 = o2[g2 >>> 24] ^ c2[w2 >> 16 & 255] ^ l2[y2 >> 8 & 255] ^ h2[255 & _2] ^ n2[m2], f2 = o2[w2 >>> 24] ^ c2[y2 >> 16 & 255] ^ l2[_2 >> 8 & 255] ^ h2[255 & g2] ^ n2[m2 + 1], d2 = o2[y2 >>> 24] ^ c2[_2 >> 16 & 255] ^ l2[g2 >> 8 & 255] ^ h2[255 & w2] ^ n2[m2 + 2], _2 = o2[_2 >>> 24] ^ c2[g2 >> 16 & 255] ^ l2[w2 >> 8 & 255] ^ h2[255 & y2] ^ n2[m2 + 3], m2 += 4, g2 = p2, w2 = f2, y2 = d2;
      for (let e3 = 0; 4 > e3; e3++)
        a2[t2 ? 3 & -e3 : e3] = u2[g2 >>> 24] << 24 ^ u2[w2 >> 16 & 255] << 16 ^ u2[y2 >> 8 & 255] << 8 ^ u2[255 & _2] ^ n2[m2++], p2 = g2, g2 = w2, w2 = y2, y2 = _2, _2 = p2;
      return a2;
    }
  }, N = class {
    constructor(e2, t2) {
      this._prf = e2, this._initIv = t2, this._iv = t2;
    }
    reset() {
      this._iv = this._initIv;
    }
    update(e2) {
      return this.calculate(this._prf, e2, this._iv);
    }
    incWord(e2) {
      if (255 == (e2 >> 24 & 255)) {
        let t2 = e2 >> 16 & 255, n2 = e2 >> 8 & 255, s2 = 255 & e2;
        255 === t2 ? (t2 = 0, 255 === n2 ? (n2 = 0, 255 === s2 ? s2 = 0 : ++s2) : ++n2) : ++t2, e2 = 0, e2 += t2 << 16, e2 += n2 << 8, e2 += s2;
      } else
        e2 += 1 << 24;
      return e2;
    }
    incCounter(e2) {
      0 === (e2[0] = this.incWord(e2[0])) && (e2[1] = this.incWord(e2[1]));
    }
    calculate(e2, t2, n2) {
      let s2;
      if (!(s2 = t2.length))
        return [];
      const r2 = k.bitLength(t2);
      for (let r3 = 0; s2 > r3; r3 += 4) {
        this.incCounter(n2);
        const s3 = e2.encrypt(n2);
        t2[r3] ^= s3[0], t2[r3 + 1] ^= s3[1], t2[r3 + 2] ^= s3[2], t2[r3 + 3] ^= s3[3];
      }
      return k.clamp(t2, r2);
    }
  }, O = T.hmacSha1;
  class G extends f {
    constructor(n2, a2, i2) {
      let o2;
      super({ start() {
        t.assign(this, { ready: new l((e2) => this.resolveReady = e2), password: n2, signed: a2, strength: i2 - 1, pending: new r() });
      }, async transform(t2, n3) {
        const a3 = this;
        if (a3.password) {
          const n4 = a3.password;
          a3.password = null;
          const r2 = Z(t2, 0, A[a3.strength] + 2);
          await (async (e2, t3, n5) => {
            await Q(e2, n5, Z(t3, 0, A[e2.strength]));
            const r3 = Z(t3, A[e2.strength]), a4 = e2.keys.passwordVerification;
            if (a4[0] != r3[0] || a4[1] != r3[1])
              throw new s(C);
          })(a3, r2, n4), a3.ctr = new N(new F(a3.keys.key), e.from(K)), a3.hmac = new O(a3.keys.authentication), t2 = Z(t2, A[a3.strength] + 2), a3.resolveReady();
        } else
          await a3.ready;
        const i3 = new r(t2.length - H - (t2.length - H) % D);
        n3.enqueue(J(a3, t2, i3, 0, H, true));
      }, async flush(e2) {
        const t2 = this;
        await t2.ready;
        const n3 = t2.pending, s2 = Z(n3, 0, n3.length - H), a3 = Z(n3, n3.length - H);
        let i3 = new r();
        if (s2.length) {
          const e3 = ee(j, s2);
          t2.hmac.update(e3);
          const n4 = t2.ctr.update(e3);
          i3 = $(j, n4);
        }
        if (o2.valid = true, t2.signed) {
          const e3 = Z($(j, t2.hmac.digest()), 0, H);
          for (let t3 = 0; H > t3; t3++)
            e3[t3] != a3[t3] && (o2.valid = false);
        }
        e2.enqueue(i3);
      } }), o2 = this;
    }
  }
  class X extends f {
    constructor(n2, s2) {
      let a2;
      super({ start() {
        t.assign(this, { ready: new l((e2) => this.resolveReady = e2), password: n2, strength: s2 - 1, pending: new r() });
      }, async transform(t2, n3) {
        const s3 = this;
        let a3 = new r();
        if (s3.password) {
          const t3 = s3.password;
          s3.password = null, a3 = await (async (e2, t4) => {
            const n4 = (s4 = new r(A[e2.strength]), E ? u.getRandomValues(s4) : z.getRandomValues(s4));
            var s4;
            return await Q(e2, t4, n4), Y(n4, e2.keys.passwordVerification);
          })(s3, t3), s3.ctr = new N(new F(s3.keys.key), e.from(K)), s3.hmac = new O(s3.keys.authentication), s3.resolveReady();
        } else
          await s3.ready;
        const i2 = new r(a3.length + t2.length - t2.length % D);
        i2.set(a3, 0), n3.enqueue(J(s3, t2, i2, a3.length, 0));
      }, async flush(e2) {
        const t2 = this;
        await t2.ready;
        let n3 = new r();
        if (t2.pending.length) {
          const e3 = t2.ctr.update(ee(j, t2.pending));
          t2.hmac.update(e3), n3 = $(j, e3);
        }
        a2.signature = $(j, t2.hmac.digest()).slice(0, H), e2.enqueue(Y(n3, a2.signature));
      } }), a2 = this;
    }
  }
  function J(e2, t2, n2, s2, a2, i2) {
    const o2 = t2.length - a2;
    let c2;
    for (e2.pending.length && (t2 = Y(e2.pending, t2), n2 = ((e3, t3) => {
      if (t3 && t3 > e3.length) {
        const n3 = e3;
        (e3 = new r(t3)).set(n3, 0);
      }
      return e3;
    })(n2, o2 - o2 % D)), c2 = 0; o2 - D >= c2; c2 += D) {
      const r2 = ee(j, Z(t2, c2, c2 + D));
      i2 && e2.hmac.update(r2);
      const a3 = e2.ctr.update(r2);
      i2 || e2.hmac.update(a3), n2.set($(j, a3), c2 + s2);
    }
    return e2.pending = Z(t2, c2), n2;
  }
  async function Q(e2, n2, s2) {
    const a2 = ((e3) => {
      if (void 0 === h) {
        const t2 = new r((e3 = unescape(encodeURIComponent(e3))).length);
        for (let n3 = 0; n3 < t2.length; n3++)
          t2[n3] = e3.charCodeAt(n3);
        return t2;
      }
      return new h().encode(e3);
    })(n2), i2 = await ((e3, t2, n3, s3, r2) => M ? u.subtle.importKey("raw", t2, n3, false, r2) : T.importKey(t2))(0, a2, I, 0, q), o2 = await (async (e3, t2, n3) => L ? await u.subtle.deriveBits(e3, t2, n3) : T.pbkdf2(t2, e3.salt, V.iterations, n3))(t.assign({ salt: s2 }, V), i2, 8 * (2 * B[e2.strength] + 2)), c2 = new r(o2);
    e2.keys = { key: ee(j, Z(c2, 0, B[e2.strength])), authentication: ee(j, Z(c2, B[e2.strength], 2 * B[e2.strength])), passwordVerification: Z(c2, 2 * B[e2.strength]) };
  }
  function Y(e2, t2) {
    let n2 = e2;
    return e2.length + t2.length && (n2 = new r(e2.length + t2.length), n2.set(e2, 0), n2.set(t2, e2.length)), n2;
  }
  function Z(e2, t2, n2) {
    return e2.subarray(t2, n2);
  }
  function $(e2, t2) {
    return e2.fromBits(t2);
  }
  function ee(e2, t2) {
    return e2.toBits(t2);
  }
  class te extends f {
    constructor(e2, n2) {
      let r2;
      super({ start() {
        t.assign(this, { password: e2, passwordVerification: n2 }), ae(this, e2);
      }, transform(e3, t2) {
        const n3 = this;
        if (n3.password) {
          const t3 = se(n3, e3.subarray(0, 12));
          if (n3.password = null, t3[11] != n3.passwordVerification)
            throw new s(C);
          e3 = e3.subarray(12);
        }
        t2.enqueue(se(n3, e3));
      }, flush() {
        r2.valid = true;
      } }), r2 = this;
    }
  }
  class ne extends f {
    constructor(e2, n2) {
      super({ start() {
        t.assign(this, { password: e2, passwordVerification: n2 }), ae(this, e2);
      }, transform(e3, t2) {
        const n3 = this;
        let s2, a2;
        if (n3.password) {
          n3.password = null;
          const t3 = u.getRandomValues(new r(12));
          t3[11] = n3.passwordVerification, s2 = new r(e3.length + t3.length), s2.set(re(n3, t3), 0), a2 = 12;
        } else
          s2 = new r(e3.length), a2 = 0;
        s2.set(re(n3, e3), a2), t2.enqueue(s2);
      }, flush() {
      } });
    }
  }
  function se(e2, t2) {
    const n2 = new r(t2.length);
    for (let s2 = 0; s2 < t2.length; s2++)
      n2[s2] = oe(e2) ^ t2[s2], ie(e2, n2[s2]);
    return n2;
  }
  function re(e2, t2) {
    const n2 = new r(t2.length);
    for (let s2 = 0; s2 < t2.length; s2++)
      n2[s2] = oe(e2) ^ t2[s2], ie(e2, t2[s2]);
    return n2;
  }
  function ae(e2, t2) {
    e2.keys = [305419896, 591751049, 878082192], e2.crcKey0 = new m(e2.keys[0]), e2.crcKey2 = new m(e2.keys[2]);
    for (let n2 = 0; n2 < t2.length; n2++)
      ie(e2, t2.charCodeAt(n2));
  }
  function ie(e2, t2) {
    e2.crcKey0.append([t2]), e2.keys[0] = ~e2.crcKey0.get(), e2.keys[1] = le(e2.keys[1] + ce(e2.keys[0])), e2.keys[1] = le(n.imul(e2.keys[1], 134775813) + 1), e2.crcKey2.append([e2.keys[1] >>> 24]), e2.keys[2] = ~e2.crcKey2.get();
  }
  function oe(e2) {
    const t2 = 2 | e2.keys[2];
    return ce(n.imul(t2, 1 ^ t2) >>> 8);
  }
  function ce(e2) {
    return 255 & e2;
  }
  function le(e2) {
    return 4294967295 & e2;
  }
  class he extends f {
    constructor(e2, t2) {
      let n2;
      super({ start() {
        n2 = new e2(t2);
      }, transform(e3, t3) {
        e3 = n2.append(e3), t3.enqueue(e3);
      }, flush(e3) {
        const t3 = n2.flush();
        t3 && e3.enqueue(t3);
      } });
    }
  }
  const ue = "Invalid signature", pe = "deflate-raw", fe = "undefined", de = typeof w == fe, ge = typeof y == fe;
  let we = true, ye = true;
  class _e extends f {
    constructor(e2, t2, { chunkSize: n2 }, ...s2) {
      super({}, ...s2);
      const { compressed: r2, encrypted: a2, useCompressionStream: i2, password: o2, passwordVerification: l2, encryptionStrength: h2, zipCrypto: u2, signed: p2, level: f2 } = t2, d2 = this;
      let g2, y2, _2 = ke(super.readable);
      if (a2 && !u2 || !p2 || ([_2, g2] = _2.tee(), g2 = g2.pipeThrough(new b())), r2)
        if (void 0 !== i2 && !i2 || de && !ye)
          _2 = be(e2, _2, { chunkSize: n2, level: f2 });
        else
          try {
            _2 = _2.pipeThrough(new w(pe));
          } catch (t3) {
            ye = false, _2 = be(e2, _2, { chunkSize: n2, level: f2 });
          }
      a2 && (u2 ? _2 = _2.pipeThrough(new ne(o2, l2)) : (y2 = new X(o2, h2), _2 = _2.pipeThrough(y2))), ve(d2, _2, async () => {
        let e3;
        a2 && !u2 && (e3 = y2.signature), a2 && !u2 || !p2 || (e3 = await g2.getReader().read(), e3 = new c(e3.value.buffer).getUint32(0)), d2.signature = e3;
      });
    }
  }
  class me extends f {
    constructor(e2, t2, { chunkSize: n2 }, ...r2) {
      super({}, ...r2);
      const { zipCrypto: a2, encrypted: i2, password: o2, passwordVerification: l2, signed: h2, encryptionStrength: u2, compressed: p2, useCompressionStream: f2 } = t2;
      let d2, g2, w2 = ke(super.readable);
      if (i2 && (a2 ? w2 = w2.pipeThrough(new te(o2, l2)) : (g2 = new G(o2, h2, u2), w2 = w2.pipeThrough(g2))), p2)
        if (void 0 !== f2 && !f2 || ge && !we)
          w2 = be(e2, w2, { chunkSize: n2 });
        else
          try {
            w2 = w2.pipeThrough(new y(pe));
          } catch (t3) {
            we = false, w2 = be(e2, w2, { chunkSize: n2 });
          }
      i2 && !a2 || !h2 || ([w2, d2] = w2.tee(), d2 = d2.pipeThrough(new b())), ve(this, w2, async () => {
        if (i2 && !a2 && !g2.valid)
          throw new s(ue);
        if ((!i2 || a2) && h2) {
          const e3 = await d2.getReader().read(), n3 = new c(e3.value.buffer);
          if (t2.signature != n3.getUint32(0, false))
            throw new s(ue);
        }
      });
    }
  }
  function be(e2, t2, n2) {
    return t2.pipeThrough(new he(e2, n2));
  }
  function ke(e2) {
    return e2.pipeThrough(new f({ transform(e3, t2) {
      e3 && e3.length && t2.enqueue(e3);
    } }));
  }
  function ve(e2, n2, s2) {
    e2.size = 0, n2 = n2.pipeThrough(new f({ transform(t2, n3) {
      t2 && t2.length && (e2.size += t2.length, n3.enqueue(t2));
    }, flush: s2 })), t.defineProperty(e2, "readable", { get: () => n2 });
  }
  const Se = "deflate", ze = "inflate", Te = "data";
  class Ce {
    constructor(e2, t2, n2, s2, r2) {
      const { codecType: a2 } = s2;
      async function i2(a3) {
        const i3 = new a3(e2, s2, r2);
        await t2.pipeThrough(i3).pipeTo(n2, { preventClose: true });
        const { size: o2, signature: c2 } = i3;
        return { size: o2, signature: c2 };
      }
      a2.startsWith(Se) ? this.run = () => i2(_e) : a2.startsWith(ze) && (this.run = () => i2(me));
    }
  }
  const De = /* @__PURE__ */ new Map();
  let Re, Ie = 0;
  async function Ve(e2) {
    try {
      const { options: t2, scripts: n2, config: s2 } = e2, { codecType: r2 } = t2;
      let a2;
      n2 && n2.length && importScripts.apply(void 0, n2), self.initCodec && self.initCodec(), r2.startsWith(Se) ? a2 = self.Deflate : r2.startsWith(ze) && (a2 = self.Inflate);
      const i2 = { highWaterMark: 1, size: () => s2.chunkSize }, o2 = new d({ async pull(e3) {
        let t3 = new l((e4, t4) => De.set(Ie, { resolve: e4, reject: t4 }));
        qe({ type: "pull", messageId: Ie }), Ie = (Ie + 1) % Number.MAX_SAFE_INTEGER;
        const { value: n3, done: s3 } = await t3;
        e3.enqueue(n3), s3 && e3.close();
      } }, i2), c2 = new g({ write(e3) {
        qe({ type: Te, data: e3 });
      } }, i2);
      Re = new Ce(a2, o2, c2, t2, s2), qe({ type: "close", result: await Re.run() });
    } catch (e3) {
      const { message: t2, stack: n2 } = e3;
      p({ error: { message: t2, stack: n2 } });
    }
  }
  function qe(e2) {
    if (e2.data) {
      let { data: t2 } = e2;
      if (t2 && t2.length)
        try {
          t2 = new r(t2), e2.data = t2.buffer, p(e2, [e2.data]);
        } catch (t3) {
          p(e2);
        }
      else
        p(e2);
    } else
      p(e2);
  }
  function Ae(e2, n2, s2) {
    return class {
      constructor(a3) {
        const i2 = this;
        t.hasOwn(a3, "level") && void 0 === a3.level && delete a3.level, i2.codec = new e2(t.assign({}, n2, a3)), s2(i2.codec, (e3) => {
          if (i2.pendingData) {
            const { pendingData: t2 } = i2;
            i2.pendingData = new r(t2.length + e3.length), t2.set(t2, 0), t2.set(e3, t2.length);
          } else
            i2.pendingData = new r(e3);
        });
      }
      append(e3) {
        return this.codec.push(e3), a2(this);
      }
      flush() {
        return this.codec.push(new r(), true), a2(this);
      }
    };
    function a2(e3) {
      if (e3.pendingData) {
        const t2 = e3.pendingData;
        return e3.pendingData = null, t2;
      }
      return new r();
    }
  }
  addEventListener("message", async (e2) => {
    const t2 = e2.data, { type: n2, messageId: s2, data: a2, done: i2 } = t2;
    try {
      if ("start" == n2 && Ve(t2), n2 == Te) {
        const { resolve: e3 } = De.get(s2);
        De.delete(s2), e3({ value: new r(a2), done: i2 });
      }
    } catch (e3) {
      p({ error: { message: e3.message, stack: e3.stack } });
    }
  }), self.initCodec = () => {
    const { Deflate: e2, Inflate: t2 } = ((e3, t3 = {}, n2) => ({ Deflate: Ae(e3.Deflate, t3.deflate, n2), Inflate: Ae(e3.Inflate, t3.inflate, n2) }))(pako, { deflate: { raw: true }, inflate: { raw: true } }, (e3, t3) => e3.onData = t3);
    self.Deflate = e2, self.Inflate = t2;
  };
}();
