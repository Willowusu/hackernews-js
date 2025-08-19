export type ItemType = "job" | "story" | "comment" | "poll" | "pollopt";

export interface BaseItem {
  id: number;
  deleted?: boolean;
  type?: ItemType;
  by?: string;
  time?: number;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  text?: string;
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface User {
  id: string;
  created?: number;
  karma?: number;
  about?: string;
  submitted?: number[];
}

export interface Updates {
  items: number[];
  profiles: string[];
}

export interface CacheLike<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  delete?(key: K): void;
  clear?(): void;
}
