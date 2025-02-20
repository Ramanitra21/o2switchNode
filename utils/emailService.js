/** @format */

const nodemailer = require("nodemailer");
require("dotenv").config();

// Vérification des variables d'environnement
if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS
) {
  console.error(
    "Erreur : Certaines variables d'environnement pour l'email ne sont pas définies."
  );
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT), // Assurer que le port est bien un nombre
  secure: process.env.EMAIL_SECURE === "true", // Convertir la valeur en booléen
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplate = (
  title,
  subtitle,
  name,
  counterpart,
  practice,
  date,
  time,
  location,
  reason
) => {
  return `
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #f8f8f8; color: #1e365c; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 2rem; line-height: 1.5; }
        .container { max-width: 500px; width: 100%; background: white; padding: 3rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); }
        .btn { background: #0037ff; color: white; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; width: 100%; font-size: 0.9rem; text-decoration: none; display: inline-block; }
        .support { margin-top: 2rem; color: #666; font-size: 0.8rem; }
        .support a { color: #0037ff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p class="subtitle">${subtitle
          .replace("{name}", name)
          .replace("{counterpart}", counterpart)
          .replace("{practice}", practice)}</p>
        <p><strong>Date :</strong> ${date} à ${time}</p>
        <p><strong>Lieu :</strong> ${location}</p>
        <p><strong>Motif :</strong> ${reason}</p>
        <a href="#" class="btn">Voir dans votre compte</a>
      </div>
      <div class="support">
        <a href="mailto:support@votreclinique.com">support@votreclinique.com</a>
      </div>
    </body>
    </html>
  `;
};

async function envoyerMailRendezVous(
  patientEmail,
  patientName,
  practitionerEmail,
  practitionerName,
  practice,
  date,
  time,
  location,
  reason
) {
  try {
    const mailOptionsPatient = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: "Confirmation de votre Rendez-Vous",
      html: emailTemplate(
        "Confirmation de votre Rendez-Vous",
        "Cher {name}, votre rendez-vous avec {counterpart} en {practice} est bien confirmé.",
        patientName,
        practitionerName,
        practice,
        date,
        time,
        location,
        reason
      ),
    };

    const mailOptionsPraticien = {
      from: process.env.EMAIL_USER,
      to: practitionerEmail,
      subject: "Nouveau Rendez-Vous",
      html: emailTemplate(
        "Un Rendez-Vous vous a été attribué",
        "Vous avez un rendez-vous avec {name} pour {practice}.",
        practitionerName,
        patientName,
        practice,
        date,
        time,
        location,
        reason
      ),
    };

    await transporter.sendMail(mailOptionsPatient);
    await transporter.sendMail(mailOptionsPraticien);

    console.log("Emails envoyés avec succès.");
    return { success: true, message: "Emails envoyés avec succès." };
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails:", error.message);
    return { success: false, message: "Erreur lors de l'envoi des emails." };
  }
}

module.exports = { envoyerMailRendezVous };
