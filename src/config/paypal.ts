import paypal from 'paypal-rest-sdk';
import dotenv from 'dotenv';

dotenv.config();

paypal.configure({
  mode: 'live', // Cambiar a 'live' para producción
  client_id: process.env.PAYPAL_CLIENT_ID || '',
  client_secret: process.env.PAYPAL_CLIENT_SECRET || ''
});

export default paypal;
