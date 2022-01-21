import { NestedValue } from './form';

/*
Projects that React Hook Form installed don't include the DOM library need these interfaces to compile.
React Native applications is no DOM available. The JavaScript runtime is ES6/ES2015 only.
These definitions allow such projects to compile with only --lib ES6.

Warning: all of these interfaces are empty.
If you want type definitions for various properties, you need to add `--lib DOM` (via command line or tsconfig.json).
*/

export type Noop = () => void;

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

interface FileList {
  readonly length: number;
  item(index: number): File | null;
  [index: number]: File;
}

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type EmptyObject = { [K in string | number]: never };

export type NonUndefined<T> = T extends undefined ? never : T;

export type LiteralUnion<T extends U, U extends Primitive> =
  | T
  | (U & { _?: never });

export type DeepPartial<T> = T extends
  | Date
  | FileList
  | File
  | NestedValue
  | unknown
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };

export type DeepPartialSkipArrayKey<T> = T extends
  | Date
  | FileList
  | File
  | NestedValue
  ? T
  : T extends ReadonlyArray<any>
  ? { [K in keyof T]: DeepPartialSkipArrayKey<T[K]> }
  : { [K in keyof T]?: DeepPartialSkipArrayKey<T[K]> };

/**
 * Checks whether the type is any
 * See {@link https://stackoverflow.com/a/49928360/3406963}
 * @typeParam T - type which may be any
 * ```
 * IsAny<any> = true
 * IsAny<string> = false
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Checks whether the type is unknown
 * @typeParam T - type which may be unknown
 * ```
 * IsUnknown<unknown> = true
 * IsUnknown<string> = false
 * ```
 */
export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
  ? true
  : false;

/**
 * Checks whether the type is never
 * @typeParam T - type which may be never
 * ```
 * IsAny<never> = true
 * IsAny<string> = false
 * ```
 */
export type IsNever<T> = [T] extends [never] ? true : false;

export type DeepMap<T, TValue> = IsAny<T> extends true
  ? any
  : IsUnknown<T> extends true
  ? unknown
  : T extends Date | FileList | File | NestedValue
  ? TValue
  : T extends object
  ? { [K in keyof T]: DeepMap<NonUndefined<T[K]>, TValue> }
  : TValue;

export type IsFlatObject<T extends object> = Extract<
  Exclude<T[keyof T], NestedValue | Date | FileList>,
  any[] | object
> extends never
  ? true
  : false;
