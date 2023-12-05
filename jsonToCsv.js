const fs = require("fs").promises;

async function processJsonToCsv() {
  try {
    const input = await fs.readFile("./input.json", "utf-8");
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
        const currencyIsoCode = element.CurrencyIsoCode;
        const unitPrice = element.UnitPrice;

        const hasProduct = products.some(p => p.productId === productId);
        if (!hasProduct) {
          products.push(new Product(productId, null, null, isActive));
        }

        const existingProduct = products.find((p) => p.productId === productId);
        if (currencyIsoCode === "EUR" && existingProduct.priceEur === null) {
          existingProduct.priceEur = unitPrice;
        } else if (
          currencyIsoCode === "RON" &&
          existingProduct.priceRon === null
        ) {
          existingProduct.priceRon = unitPrice;
        }
      });
      const headers = Object.keys(products[0]);
      const csvHeader =[
          "Product StockKeepingUnit",
          "Price (01s68000002d6IvAAI) EUR",
          "Price (01s68000002d6IvAAI) RON",
          "IsActive",
        ].join(",") + "\n";

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
    await fs.writeFile("output1.csv", csvContent, "utf8");
  } catch (error) {
    throw new Error('An error occurred while processing JSON to CSV', error);
  }
}

processJsonToCsv();

