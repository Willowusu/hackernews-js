# 📦 hackernews-js

[![npm version](https://img.shields.io/npm/v/hackernews-js)](https://www.npmjs.com/package/hackernews-js)
[![Build Status](https://github.com/willowusu/hackernews-js/actions/workflows/ci.yml/badge.svg)](https://github.com/willowusu/hackernews-js/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight **JavaScript/TypeScript wrapper** for the [Hacker News API](https://github.com/HackerNews/API).
Provides typed methods to fetch stories, items, users, and more — with built-in caching.

---

## 🚀 Features

* ✅ Simple wrapper around the official Hacker News API
* ✅ TypeScript support (fully typed responses)
* ✅ Built-in **LRU cache** for better performance
* ✅ ESM & CJS builds
* ✅ Tested with **Vitest**

---

## 📥 Installation

```bash
npm install hackernews-js
```

or

```bash
yarn add hackernews-js
```

---

## 🛠 Usage

```ts
import { HackerNewsClient } from "hackernews-js";

const hn = new HackerNewsClient({ cacheSize: 100 });

// Get top stories
const topStories = await hn.getTopStories();
console.log(topStories.slice(0, 5));

// Get a single item
const item = await hn.getItem(8863);
console.log(item.title);

// Get a user
const user = await hn.getUser("pg");
console.log(user.karma);
```

## Note:
In your React UI, when you create the client, explicitly tell it to use the browser’s window.fetch:
```
import { HackerNewsClient } from "hackernews-js";

const client = new HackerNewsClient({ fetch: window.fetch.bind(window) });
```

---

## 📚 API

### `new HackerNewsClient(options?)`

Create a new client.

* `options.cacheSize` (number, default: `100`) – max entries in LRU cache

---

### Methods

* `getItem(id: number)` → `Promise<Item>`
* `getUser(id: string)` → `Promise<User>`
* `getTopStories()` → `Promise<number[]>`
* `getNewStories()` → `Promise<number[]>`
* `getBestStories()` → `Promise<number[]>`
* `getAskStories()` → `Promise<number[]>`
* `getShowStories()` → `Promise<number[]>`
* `getJobStories()` → `Promise<number[]>`

---

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

---

## 📦 Build

```bash
npm run build
```

This outputs bundled files to `dist/` in both **ESM** and **CJS** formats.

---

## 📜 License

MIT © 2025 William Owusu
