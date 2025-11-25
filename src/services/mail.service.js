import { mailTransporter } from "../config/mail.config.js";

const { MAIL_FROM, BASE_URL } = process.env;

export const sendPasswordResetEmail = async (userEmail, token) => {
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: MAIL_FROM || "No Reply <no-reply@example.com>",
    to: userEmail,
    subject: "Recuperar contraseña",
    html: `
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Hacé clic en el siguiente botón (es válido por 1 hora):</p>
      <a href="${resetLink}" 
         style="display:inline-block;padding:10px 20px;border-radius:4px;
         background:#007bff;color:#fff;text-decoration:none;">
        Restablecer contraseña
      </a>
      <p>Si no fuiste vos, ignorá este correo.</p>
    `,
  };

  return mailTransporter.sendMail(mailOptions);
};