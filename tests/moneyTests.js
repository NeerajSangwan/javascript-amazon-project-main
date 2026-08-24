import { formatMoney } from "../scripts/utils/money.js";

console.log("test suite : format currency");

if (formatMoney(2020) === "20.20") {
  console.log("Pass");
} else {
  console.log("Fail");
}

if (formatMoney(2000.1) === "20.00") {
  console.log("Pass");
} else {
  console.log("Fail");
}
