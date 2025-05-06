const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;

const LOCATION_ID = "52778729626";

// SLEEP - Décrémentation de SLEEP-X3
const INVENTORY_ITEM_ID_SLEEP_X3 = "38313294528666";
const VARIANT_ID_SLEEP_X6 = 40418440282266;

// ZERO - Décrémentation de ZERO-X3
const INVENTORY_ITEM_ID_ZERO_X3 = "52335405498709";
const VARIANT_ID_ZERO_X6 = 50525294723413;

app.post("/webhook", async (req, res) => {
  const order = req.body;

  try {
    for (let item of order.line_items) {
      // 🔵 SLEEP : si la commande est pour le pack X6
      if (item.variant_id === VARIANT_ID_SLEEP_X6) {
        console.log("Commande x6 SLEEP détectée, décrémentation x2 du stock x3 SLEEP");

        await axios.post(
          `https://${SHOPIFY_STORE}/admin/api/2023-07/inventory_levels/adjust.json`,
          {
            inventory_item_id: INVENTORY_ITEM_ID_SLEEP_X3,
            location_id: LOCATION_ID,
            available_adjustment: -2,
          },
          {
            headers: {
              "X-Shopify-Access-Token": SHOPIFY_TOKEN,
              "Content-Type": "application/json",
            }
          }
        );

        console.log("✅ Stock SLEEP décrémenté de 2 unités !");
      }

      // 🟣 ZERO : si la commande est pour le pack X6
      if (item.variant_id === VARIANT_ID_ZERO_X6) {
        console.log("Commande x6 ZERO détectée, décrémentation x2 du stock x3 ZERO");

        await axios.post(
          `https://${SHOPIFY_STORE}/admin/api/2023-07/inventory_levels/adjust.json`,
          {
            inventory_item_id: INVENTORY_ITEM_ID_ZERO_X3,
            location_id: LOCATION_ID,
            available_adjustment: -2,
          },
          {
            headers: {
              "X-Shopify-Access-Token": SHOPIFY_TOKEN,
              "Content-Type": "application/json",
            }
          }
        );

        console.log("✅ Stock ZERO décrémenté de 2 unités !");
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Erreur :", error.response?.data || error.message);
    res.status(500).send("Erreur serveur");
  }
});

app.get("/", (req, res) => res.send("Stock Decrementer actif 🟢"));
app.listen(3000, () => console.log("Serveur lancé sur le port 3000"));
