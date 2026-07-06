import { renderHook, waitFor } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

const events = { events: [{ id: 1, title: "Test event" }] };
const originalLoadData = api.loadData;

describe("useData hook", () => {
  afterEach(() => {
    delete global.fetch;
  });

  it("returns no data and no error while the request is pending", () => {
    api.loadData = jest.fn().mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useData(), { wrapper: DataProvider });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("exposes the resolved data and no error when the call succeeds", async () => {
    api.loadData = jest.fn().mockResolvedValue(events);

    const { result } = renderHook(() => useData(), { wrapper: DataProvider });

    await waitFor(() => expect(result.current.data).toEqual(events));
    expect(result.current.error).toBeNull();
  });

  it("exposes the error and no data when the call fails", async () => {
    window.console.error = jest.fn();
    const failure = new Error("network error");
    api.loadData = jest.fn().mockRejectedValue(failure);

    const { result } = renderHook(() => useData(), { wrapper: DataProvider });

    await waitFor(() => expect(result.current.error).toEqual(failure));
    expect(result.current.data).toBeNull();
  });

  it("calls api.loadData only once, even after re-renders", async () => {
    api.loadData = jest.fn().mockResolvedValue(events);

    const { result, rerender } = renderHook(() => useData(), {
      wrapper: DataProvider,
    });

    await waitFor(() => expect(result.current.data).toEqual(events));
    rerender();
    rerender();

    expect(api.loadData).toHaveBeenCalledTimes(1);
  });

  it("does not call api.loadData again after a failure (no retry loop)", async () => {
    window.console.error = jest.fn();
    api.loadData = jest.fn().mockRejectedValue(new Error("boom"));

    const { result, rerender } = renderHook(() => useData(), {
      wrapper: DataProvider,
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());
    rerender();
    rerender();

    expect(api.loadData).toHaveBeenCalledTimes(1);
  });

  it("keeps the same context value reference across re-renders when data/error do not change", async () => {
    api.loadData = jest.fn().mockResolvedValue(events);

    const { result, rerender } = renderHook(() => useData(), {
      wrapper: DataProvider,
    });

    await waitFor(() => expect(result.current.data).toEqual(events));
    const firstValue = result.current;
    rerender();

    expect(result.current).toBe(firstValue);
  });
});

describe("api.loadData", () => {
  beforeEach(() => {
    api.loadData = originalLoadData;
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("fetches /events.json and returns the parsed JSON body", async () => {
    const payload = { events: [] };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(payload),
    });

    const result = await api.loadData();

    expect(global.fetch).toHaveBeenCalledWith("/events.json");
    expect(result).toEqual(payload);
  });

  it("rejects when the fetch call itself fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network down"));

    await expect(api.loadData()).rejects.toThrow("network down");
  });

  it("rejects when the response body is not valid JSON", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockRejectedValue(new Error("invalid json")),
    });

    await expect(api.loadData()).rejects.toThrow("invalid json");
  });
});
