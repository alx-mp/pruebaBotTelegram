import { Context } from "telegraf";

export function startCommand(ctx: Context) {
  ctx.reply(
    "🎉 ¡Hola! 🎉\n\n👋 Bienvenido al Bot de Prueba para Pagos. 💸\n\n Usa /instrucciones para leer las instrucciones del proceso de pago  \n\n Usa /comprar para realizar la compra del acceso al canal VIP. "
  );
}
