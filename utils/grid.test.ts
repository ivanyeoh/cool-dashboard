import { fillBlanks } from "./grid";

describe("grid", () => {
  it("fills unoccupied slots with blank widget", () => {
    expect(fillBlanks([
      { id: 1, w: 2, h: 2, x: 0, y: 0 },
    ], {
      columns: 6
    })).toStrictEqual([
      { id: 1, w: 2, h: 2, x: 0, y: 0 },
      { id: "blank-2-0", w: 1, h: 1, x: 2, y: 0, blank: true },
      { id: "blank-3-0", w: 1, h: 1, x: 3, y: 0, blank: true },
      { id: "blank-4-0", w: 1, h: 1, x: 4, y: 0, blank: true },
      { id: "blank-5-0", w: 1, h: 1, x: 5, y: 0, blank: true },
      { id: "blank-2-1", w: 1, h: 1, x: 2, y: 1, blank: true },
      { id: "blank-3-1", w: 1, h: 1, x: 3, y: 1, blank: true },
      { id: "blank-4-1", w: 1, h: 1, x: 4, y: 1, blank: true },
      { id: "blank-5-1", w: 1, h: 1, x: 5, y: 1, blank: true },
    ]);
  })

  it("fills last row when all occupied", () => {
    expect(fillBlanks([
      { id: 1, w: 1, h: 1, x: 0, y: 0 },
      { id: 2, w: 1, h: 1, x: 1, y: 0 },
      { id: 3, w: 1, h: 1, x: 2, y: 0 },
    ], {
      columns: 3
    })).toStrictEqual([
      { id: 1, w: 1, h: 1, x: 0, y: 0 },
      { id: 2, w: 1, h: 1, x: 1, y: 0 },
      { id: 3, w: 1, h: 1, x: 2, y: 0 },
      { id: "blank-0-1", w: 1, h: 1, x: 0, y: 1, blank: true },
      { id: "blank-1-1", w: 1, h: 1, x: 1, y: 1, blank: true },
      { id: "blank-2-1", w: 1, h: 1, x: 2, y: 1, blank: true },
    ]);
  })

  it("fills with 2 blanks when nothing is occupied", () => {
    expect(fillBlanks([], {
      columns: 3
    })).toStrictEqual([
      { id: "blank-0-0", w: 1, h: 1, x: 0, y: 0, blank: true },
      { id: "blank-1-0", w: 1, h: 1, x: 1, y: 0, blank: true },
      { id: "blank-2-0", w: 1, h: 1, x: 2, y: 0, blank: true },
      { id: "blank-0-1", w: 1, h: 1, x: 0, y: 1, blank: true },
      { id: "blank-1-1", w: 1, h: 1, x: 1, y: 1, blank: true },
      { id: "blank-2-1", w: 1, h: 1, x: 2, y: 1, blank: true },
    ]);
  })

  it("shift up when no item in row", () => {
    expect(fillBlanks([
      { id: "blank-0-0", w: 1, h: 1, x: 0, y: 0, blank: true },
      { id: "blank-1-0", w: 1, h: 1, x: 1, y: 0, blank: true },
      { id: "blank-2-0", w: 1, h: 1, x: 2, y: 0, blank: true },
      { id: 1, w: 1, h: 1, x: 0, y: 0 },
      { id: 2, w: 1, h: 1, x: 1, y: 0 },
      { id: 3, w: 1, h: 1, x: 2, y: 0 },
    ], {
      columns: 3
    })).toStrictEqual([
      { id: 1, w: 1, h: 1, x: 0, y: 0 },
      { id: 2, w: 1, h: 1, x: 1, y: 0 },
      { id: 3, w: 1, h: 1, x: 2, y: 0 },
      { id: "blank-0-1", w: 1, h: 1, x: 0, y: 1, blank: true },
      { id: "blank-1-1", w: 1, h: 1, x: 1, y: 1, blank: true },
      { id: "blank-2-1", w: 1, h: 1, x: 2, y: 1, blank: true },
    ]);

    expect(fillBlanks([
      { id: 1, w: 1, h: 1, x: 0, y: 0 },
      { id: 2, w: 1, h: 1, x: 1, y: 0 },
      { id: 3, w: 1, h: 1, x: 2, y: 0 },
      { id: "blank-0-1", w: 1, h: 1, x: 0, y: 1, blank: true },
      { id: "blank-1-1", w: 1, h: 1, x: 1, y: 1, blank: true },
      { id: "blank-2-1", w: 1, h: 1, x: 2, y: 1, blank: true },
      { id: 4, w: 1, h: 1, x: 0, y: 2 },
      { id: 5, w: 1, h: 1, x: 1, y: 2 },
    ], {
      columns: 3
    })).toStrictEqual([
      { id: 1, w: 1, h: 1, x: 0, y: 0 },
      { id: 2, w: 1, h: 1, x: 1, y: 0 },
      { id: 3, w: 1, h: 1, x: 2, y: 0 },
      { id: 4, w: 1, h: 1, x: 0, y: 1 },
      { id: 5, w: 1, h: 1, x: 1, y: 1 },
      { id: "blank-2-1", w: 1, h: 1, x: 2, y: 1, blank: true },
    ]);
  })
})