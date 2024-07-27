import { Context } from 'telegraf';

export async function instruccionesCommand(ctx: Context) {
  const user = ctx.from ? ctx.from.first_name : 'Usuario';

  const instrucciones = `
✨ Instrucciones para realizar tu compra ✨

1️⃣  Usa el comando /comprar. 🛒
2️⃣  Serás redirigido a PayPal para finalizar tu compra. 💳
3️⃣  Una vez completado el pago, serás redirigido al enlace del grupo VIP. 🎉
4️⃣  Usa el comando /validarPago y envía una imagen del comprobante. 📸
5️⃣  Puedes enviar un máximo de 2 fotos por día. 

⚠️ Recuerda incluir el nombre del usuario que efectuó el pago para una validación rápida.

📩 Si tienes alguna pregunta, contacta al administrador.

Gracias por tu compra y disfruta de nuestro servicio. 🙌
  `;

  const escapedInstrucciones = instrucciones
    .replace(/([_*[\]()~>`#+\-=|{}.!])/g, '\\$1'); // Escapa caracteres especiales

  try {
    await ctx.reply(escapedInstrucciones, { parse_mode: 'MarkdownV2' });
    console.log("Instrucciones enviadas exitosamente.");
  } catch (error) {
    console.error("Error al enviar las instrucciones:", error);
    await ctx.reply("🚨 Hubo un error al intentar enviar las instrucciones. Por favor, inténtalo de nuevo más tarde.");
  }
}
