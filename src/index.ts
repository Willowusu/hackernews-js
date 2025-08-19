import { BaseItem, User, Updates, CacheLike } from "./types";
import { htmlToText, toDate } from "./utils";

const DEFAULT_BASE = "https://hacker-news.firebaseio.com/v0";

export interface ClientOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  concurrency?: number;
  cache?: CacheLike<number | string, any>;
  userAgent?: string;
}

export class HNClient {
  private baseUrl: string;
  private fetchImpl: typeof globalThis.fetch;
  private timeoutMs: number;
  private concurrency: number;
  private cache?: CacheLike<number | string, any>;
  private queue: (() => Promise<void>)[] = [];
  private active = 0;
  private userAgent?: string;

  constructor(opts: ClientOptions = {}) {
    this.baseUrl = opts.baseUrl || DEFAULT_BASE;
    this.fetchImpl = opts.fetch || globalThis.fetch;
    this.timeoutMs = opts.timeoutMs ?? 10_000;
    this.concurrency = opts.concurrency ?? 5;
    this.cache = opts.cache;
    this.userAgent = opts.userAgent;
  }

  private async request<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    const cacheKey = url;
    if (this.cache) {
      const cached = this.cache.get(cacheKey);
      if (cached !== undefined) return cached as T;
    }

    return new Promise<T>((resolve, reject) => {
      const run = async () => {
        this.active++;
        try {
          const ctrl = new AbortController();
          const id = setTimeout(() => ctrl.abort(), this.timeoutMs);
          const res = await this.fetchImpl(url, {
            signal: ctrl.signal,
            headers: this.userAgent ? { "User-Agent": this.userAgent } : {},
          });
          clearTimeout(id);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as T;
          if (this.cache) this.cache.set(cacheKey, data);
          resolve(data);
        } catch (err) {
          reject(err);
        } finally {
          this.active--;
          this.next();
        }
      };

      this.queue.push(run);
      this.next();
    });
  }

  private next() {
    while (this.active < this.concurrency && this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) fn();
    }
  }

  // ---------------------------
  // Core API Methods
  // ---------------------------

  async getItem(id: number): Promise<BaseItem | null> {
    return this.request<BaseItem | null>(`item/${id}.json`);
  }

  async getUser(id: string): Promise<User | null> {
    return this.request<User | null>(`user/${id}.json`);
  }

  async getUpdates(): Promise<Updates> {
    return this.request<Updates>("updates.json");
  }

  async getTopStories(): Promise<number[]> {
    return this.request("topstories.json");
  }

  async getNewStories(): Promise<number[]> {
    return this.request("newstories.json");
  }

  async getBestStories(): Promise<number[]> {
    return this.request("beststories.json");
  }

  async getAskStories(): Promise<number[]> {
    return this.request("askstories.json");
  }

  async getShowStories(): Promise<number[]> {
    return this.request("showstories.json");
  }

  async getJobStories(): Promise<number[]> {
    return this.request("jobstories.json");
  }

  // ---------------------------
  // Extras: Pagination
  // ---------------------------

  async getListPage(
    list:
      | "top"
      | "new"
      | "best"
      | "ask"
      | "show"
      | "job",
    page: number,
    pageSize: number
  ): Promise<{ ids: number[]; items: (BaseItem | null)[] }> {
    const map: Record<string, () => Promise<number[]>> = {
      top: () => this.getTopStories(),
      new: () => this.getNewStories(),
      best: () => this.getBestStories(),
      ask: () => this.getAskStories(),
      show: () => this.getShowStories(),
      job: () => this.getJobStories(),
    };
    const ids = await map[list]();
    const start = (page - 1) * pageSize;
    const slice = ids.slice(start, start + pageSize);
    const items = await Promise.all(slice.map((id) => this.getItem(id)));
    return { ids: slice, items };
  }

  // ---------------------------
  // Extras: Hydration
  // ---------------------------

  async getStoryWithComments(
    id: number,
    opts: { maxDepth?: number; maxComments?: number } = {}
  ): Promise<BaseItem & { comments: any[] }> {
    const story = await this.getItem(id);
    if (!story) throw new Error("Story not found");
    const maxDepth = opts.maxDepth ?? 3;
    const maxComments = opts.maxComments ?? 50;

    const fetchComments = async (
      ids: number[] | undefined,
      depth: number
    ): Promise<any[]> => {
      if (!ids || depth > maxDepth) return [];
      const limited = ids.slice(0, maxComments);
      const comments = await Promise.all(
        limited.map(async (cid) => {
          const c = await this.getItem(cid);
          if (!c) return null;
          const kids = await fetchComments(c.kids, depth + 1);
          return { ...c, comments: kids };
        })
      );
      return comments.filter(Boolean);
    };

    const comments = await fetchComments(story.kids, 1);
    return { ...story, comments };
  }

  // ---------------------------
  // Extras: Batching
  // ---------------------------

  async getItems(ids: number[]): Promise<(BaseItem | null)[]> {
    return Promise.all(ids.map((id) => this.getItem(id)));
  }

  // ---------------------------
  // Utils passthrough
  // ---------------------------

  htmlToText = htmlToText;
  toDate = toDate;
}
