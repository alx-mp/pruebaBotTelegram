import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';
import { startCommand } from './commands/start';
import { comprarCommand } from './commands/comprar';
import { instruccionesCommand } from './commands/instrucciones';
import { validarPagoCommand } from './commands/validarPago';
import crypto from 'crypto';
import { Message } from 'telegraf/typings/core/types/typegram';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

bot.start(startCommand);
bot.command('comprar', comprarCommand);
bot.command('instrucciones', instruccionesCommand);
bot.command('validarPago', validarPagoCommand);

const photoLimits: { [userId: number]: { count: number, date: string } } = {};

function isPhotoMessage(message: Message): message is Message.PhotoMessage {
  return 'photo' in message;
}

function generateUserId(firstName: string, lastName: string, username?: string): string {
  const baseString = `${firstName}${lastName}${username || ''}`;
  return crypto.createHash('sha256').update(baseString).digest('hex').slice(0, 10);
}

function isUserBlocked(userId: string): boolean {
  const blockedUsers = process.env.USERS_BLOCKED?.split(',').map(id => id.trim()) || [];
  return blockedUsers.includes(userId);
}

bot.on('message', async (ctx: Context) => {
  const userId = ctx.from?.id;
  if (userId) {
    const firstName = ctx.from?.first_name || '';
    const lastName = ctx.from?.last_name || '';
    const username = ctx.from?.username;
    const userIdentifier = generateUserId(firstName, lastName, username);

    if (isUserBlocked(userIdentifier)) {
      ctx.reply('Estás bloqueado por uso indebido del bot.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (!photoLimits[userId]) {
      photoLimits[userId] = { count: 0, date: today };
    }

    if (photoLimits[userId].date !== today) {
      photoLimits[userId] = { count: 0, date: today };
    }

    if (photoLimits[userId].count >= 2) {
      ctx.reply('Has alcanzado el límite de 2 fotos por día.');
    } else {
      const adminIds = process.env.TELEGRAM_ADMIN_ID?.split(',').map(id => id.trim());
      if (!adminIds || adminIds.length === 0) {
        console.error('TELEGRAM_ADMIN_ID no está configurado correctamente en las variables de entorno.');
        return;
      }

      if (ctx.message && isPhotoMessage(ctx.message)) {
        const message = ctx.message as Message.PhotoMessage;
        const userInfo = username ? `${username} (${firstName} ${lastName})` : `${firstName} ${lastName}`;

        for (const adminId of adminIds) {
          ctx.telegram.sendPhoto(adminId, message.photo[0].file_id, { caption: `Pago recibido de ${userInfo}. ID: ${userIdentifier}` });
        }
        photoLimits[userId].count += 1;
        ctx.reply('Tu imagen ha sido enviada a los administradores.');
      } else if (ctx.message && (ctx.message as Message.TextMessage).text) {
        ctx.reply('Por favor, envía una imagen.');
      }
    }
  }
});

export default bot;
