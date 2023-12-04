const fs = require("fs");

const input = fs.readFileSync("./input.json", "utf-8");
const jsonData = JSON.parse(input);

function jsonToCsv(jsonData) {
  class Product {
    constructor(productId, priceEur, priceRon, isActive) {
      this.productId = productId;
      this.priceEur = priceEur;
      this.priceRon = priceRon;
      this.isActive = isActive;
    }
  }
  const products = [];
  jsonData.records.forEach((element) => {
    const productId = element.Product2.Article_SAP_Code__c;
    const isActive = element.IsActive;
    let priceEur = null;
    let priceRon = null;
    const items = jsonData.records.filter(
      (x) => x.Product2.Article_SAP_Code__c === productId
    );

    items.forEach((item) => {
      if (item.CurrencyIsoCode === "EUR") {
        priceEur = item.UnitPrice;
      } else if (item.CurrencyIsoCode === "RON") {
        priceRon = item.UnitPrice;
      }
    });

    const hasProduct = products.some((p) => p.productId === productId);
    if (!hasProduct) {
      products.push(new Product(productId, priceEur, priceRon, isActive));
    }
  });

  const headers = Object.keys(products[0]);
  const csvHeader =[
      "Product StockKeepingUnit",
      "Price (01s68000002d6IvAAI) EUR",
      "Price (01s68000002d6IvAAI) RON",
      "IsActive",
    ].join(',') + "\n";

  const csvRows = products
    .map((product) => {
      return headers
        .map((header) => {
          return product[header];
        })
        .join(",");
    })
    .join("\n");

  return csvHeader + csvRows;
}

const csvContent = jsonToCsv(jsonData);
fs.writeFileSync("output.csv", csvContent, "utf8");

