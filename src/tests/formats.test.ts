import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createFormat,
  deleteFormat,
  getFormat,
  listFormats,
  updateFormat,
} from "@/api/format/formatService";
import { createTestFormat } from "@/tests/testData";

const baseFormat = createTestFormat("format-test-format-1");

describe("format service (dynamo integration)", () => {
  beforeEach(async () => {
    await deleteFormat(baseFormat.id);
  });

  afterEach(async () => {
    await deleteFormat(baseFormat.id);
  });

  it("creates and fetches a format", async () => {
    await createFormat(baseFormat);
    const result = await getFormat(baseFormat.id);

    expect(result).toBeDefined();
    expect(result?.displayName).toBe(baseFormat.displayName);
  });

  it("lists all formats including the test format", async () => {
    await createFormat(baseFormat);
    const formats = await listFormats();
    const match = formats.find((f) => f.id === baseFormat.id);
    expect(match).toBeDefined();
  });

  it("lists multiple formats", async () => {
    const secondFormat = createTestFormat("format-test-format-2");
    await createFormat(baseFormat);
    await createFormat(secondFormat);

    const formats = await listFormats();
    const ids = formats.map((f) => f.id);

    expect(ids).toContain(baseFormat.id);
    expect(ids).toContain(secondFormat.id);

    await deleteFormat(secondFormat.id);
  });

  it("updates the format name", async () => {
    await createFormat(baseFormat);
    const updated = await updateFormat(baseFormat.id, {
      displayName: "Updated Format",
    });

    expect(updated.displayName).toBe("Updated Format");
  });

  it("sets the inactive flag to true", async () => {
    await createFormat(baseFormat);
    const updated = await updateFormat(baseFormat.id, { inactive: true });

    expect(updated.inactive).toBe(true);
  });

  it("deletes a format", async () => {
    await createFormat(baseFormat);
    await deleteFormat(baseFormat.id);

    const result = await getFormat(baseFormat.id);
    expect(result).toBeNull();
  });

  it("returns null for a nonexistent format", async () => {
    const result = await getFormat("nonexistent-format");
    expect(result).toBeNull();
  });

  it("throws when updating a nonexistent format", async () => {
    await expect(
      updateFormat("missing-id", { displayName: "New" }),
    ).rejects.toThrow(/does not exist/);
  });
});
