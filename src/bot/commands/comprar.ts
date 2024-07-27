import { Context } from 'telegraf';
import paypal from '../../config/paypal';
import dotenv from 'dotenv';
import { aplicarDescuento } from '../../services/discount';

dotenv.config();

const PRICE = parseFloat(process.env.PRICE || '0');
const DISCOUNT = parseFloat(process.env.DISCOUNT || '0');
const DISCOUNT_END_DATE = new Date(process.env.DISCOUNT_END_DATE || '');

export function comprarCommand(ctx: Context) {
  const precio = aplicarDescuento(DISCOUNT, PRICE, DISCOUNT_END_DATE);

  const create_payment_json = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    redirect_urls: {
      return_url: 'https://pruebabottelegram-vexcel-prueba.onrender.com/success',
      cancel_url: 'https://pruebabottelegram-vexcel-prueba.onrender.com/cancel'
    },
    transactions: [{
      item_list: {
        items: [{
          name: 'Producto',
          sku: '001',
          price: precio.toFixed(2),
          currency: 'USD',
          quantity: 1
        }]
      },
      amount: {
        currency: 'USD',
        total: precio.toFixed(2)
      },
      description: 'Compra de Producto con descuento'
    }]
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.log(error);
      ctx.reply('Hubo un error al crear el pago.');
    } else if (payment && payment.links) {
      payment.links.forEach(link => {
        if (link.rel === 'approval_url') {
          ctx.reply(`Haz clic en el siguiente enlace para realizar el pago: ${link.href}`);
        }
      });
    }
  });
}