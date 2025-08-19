import { describe, it, expect } from "vitest";
import { HNClient } from "../src/index";

describe("HNClient", () => {
  const hn = new HNClient();

  it("fetches an item", async () => {
    const item = await hn.getItem(8863);
    expect(item).toHaveProperty("id", 8863);
    expect(item?.type).toBe("story");
  });

  it("fetches a user", async () => {
    const user = await hn.getUser("pg");
    expect(user).toHaveProperty("id", "pg");
  });

  it("paginates top stories", async () => {
    const page = await hn.getListPage("top", 1, 5);
    expect(page.items.length).toBeGreaterThan(0);
  });

  it("hydrates a story with comments", async () => {
    const story = await hn.getStoryWithComments(8863, { maxDepth: 2, maxComments: 20 });
    expect(story?.id).toBe(8863);
    expect((story as any).comments).toBeDefined();
  });
});
