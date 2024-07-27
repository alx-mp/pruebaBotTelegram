import bot from './bot/bot';
import './server/server';

bot.launch().then(() => {
  console.log('Bot iniciado.');
}).catch((err) => {
  console.error('Error al iniciar el bot:', err);
});

