/** @format */

const nodemailer = require("nodemailer");
require("dotenv").config();

// Vérification des variables d'environnement
const requiredEnvVars = [
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_SECURE",
  "EMAIL_USER",
  "EMAIL_PASS",
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(
      `❌ ERREUR: La variable d'environnement ${envVar} est manquante.`
    );
    process.exit(1);
  }
});

console.log(process.env.EMAIL_HOST); // Devrait afficher 'passion-vins.fr'

const fs = require("fs");
const path = require("path");
// Lire le fichier SVG et l'encoder en base64
const svgPath = path.join(__dirname, "images/logo.svg");
const svgFile = fs.readFileSync(svgPath);
const base64Svg = Buffer.from(svgFile).toString("base64");

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT), // Assurer que le port est bien un nombre
  secure: process.env.EMAIL_SECURE === "true", // Convertir la valeur en booléen
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Modèle d'email pour confirmer la création et l'activation du compte
const accountActivatedTemplate = (name) => `
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Compte Activé</title>
</head>
<body style="margin:0; padding:0;">
	<center>
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top">
								<table width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px; width:100%;">
									<tr>
										<td align="center" valign="top">
											<img src="data:image/svg+xml;base64,${base64Svg}" alt="HelloSoin" style="display:block; margin:auto;">
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top" style="padding:20px; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">
								Bonjour ${name},
							</td>
						</tr>
						<tr>
							<td align="center" valign="top" style="padding:20px; font-size: 18px; font-family: Arial, sans-serif;">
								<p>Votre compte a été créé et activé avec succès !</p>
								<p>Vous pouvez dès à présent vous connecter et profiter de toutes nos fonctionnalités.</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top" style="padding:20px;">
								<a href="https://votre-site.com/login" style="background-color:#28a745; color:#ffffff; font-size:18px; font-weight:bold; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
									Se connecter
								</a>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<tr>
				<td align="center" valign="top">
					<table width="640" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:640px; width:100%;" bgcolor="#FFFFFF">
						<tr>
							<td align="center" valign="top" style="padding:20px; font-size:14px; color:#777; font-family: Arial, sans-serif;">
								<p>Si vous n'avez pas créé ce compte, contactez-nous immédiatement à <a href="mailto:support@votre-site.com" style="color:#28a745; text-decoration:none;">support@votre-site.com</a>.</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</center>
</body>
</html>
`;

// Fonction pour envoyer l'email de confirmation de création et d'activation
async function emailInscriptionDone(userEmail, userName) {
  try {
    if (!userEmail || !userName) {
      throw new Error("Tous les paramètres (email, nom) sont requis.");
    }

    const mailOptions = {
      from: `"Hello Soin" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Votre compte a été activé avec succès",
      text: `Votre compte a été activé avec succès, ${userName}. Vous pouvez maintenant vous connecter.`,
      html: accountActivatedTemplate(userName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `✅ Email envoyé à ${userEmail} (Message ID: ${info.messageId})`
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error.stack);
  }
}

// Exportation de la fonction
module.exports = { emailInscriptionDone };
