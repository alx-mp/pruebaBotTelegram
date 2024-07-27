import { Context } from 'telegraf';

export function validarPagoCommand(ctx: Context) {
  ctx.reply('Por favor, envía una imagen del comprobante de tu pago.');
}