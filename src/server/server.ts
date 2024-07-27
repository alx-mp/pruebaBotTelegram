import express from "express";
import paypal from "../config/paypal";
import dotenv from "dotenv";
import { aplicarDescuento } from "../services/discount";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_CHANNEL_LINK = process.env.TELEGRAM_CHANNEL_LINK || "";
const PRICE = parseFloat(process.env.PRICE || "0");
const DISCOUNT = parseFloat(process.env.DISCOUNT || "0");
const DISCOUNT_END_DATE = new Date(process.env.DISCOUNT_END_DATE || "");

app.get("/success", (req, res) => {
  const payerId = req.query.PayerID as string;
  const paymentId = req.query.paymentId as string;
  const precioFinal = aplicarDescuento(DISCOUNT, PRICE, DISCOUNT_END_DATE);

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      { amount: { currency: "USD", total: precioFinal.toFixed(2) } },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.log(error.response);
      res.send("Error al completar el pago.");
    } else {
      console.log(JSON.stringify(payment));
      res.redirect(TELEGRAM_CHANNEL_LINK);
    }
  });
});

app.get("/cancel", (req, res) => res.send("Pago cancelado."));

app.listen(PORT, () => console.log(`Servidor funcionando en puerto ${PORT}`));
