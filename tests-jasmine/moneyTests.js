import { formatMoney } from "../scripts/utils/money.js";

describe("test suite : format currency", () => {
  it("basic test case", () => {
    expect(formatMoney(2020)).toEqual("20.20");
  });
  it("edge test case", () => {
    expect(formatMoney(2000.1)).toEqual("20.00");
  });
});
