import { inspect } from 'util';

import { describe, expect, test } from 'vitest';

import { manage, readEmitter } from '../src';

describe('map and set', () => {
  test('map', () => {
    class A {
      public m = new Map<string, number>();
    }
    const a = new A();
    const ma = manage(a);
    ma.m.set('a', 1);
    expect(ma.m.get('a')).toBe(1);
    expect(ma.m.has('a')).toBe(true);
  });
  test('set', () => {
    class A {
      public s = new Set<string>();
    }
    const a = new A();
    const ma = manage(a);
    ma.s.add('a');
    expect(ma.s.has('a')).toBe(true);
  });
  test('traps', () => {
    class A {
      public m = new Map<string, number>();
    }
    const a = new A();
    const ma = manage(a);
    ma.m.set('a', 1);
    const [, readLogs] = readEmitter.run(() => {
      expect(ma.m.get('a')).toBe(1);
      expect(ma.m.has('a')).toBe(true);
    });
    expect(inspect(readLogs)).toBe(`Map(2) {
  A { m: Map(1) { 'a' => 1 } } => { get: { m: [Map] }, has: {} },
  Map(1) { 'a' => 1 } => { get: { a: 1 }, has: { a: true } }
}`);
  });
});
