import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8496898839:AAEd01EKYQwxPIqCtNtaJ1VqOsXGSTgTzi4';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '849689883';

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  department: string;
  startDate: string;
  motivation: string;
  salary: string;
  portfolio: string;
  remote: string;
  availability: string;
  message: string;
  gdpr: boolean;
  newsletter: boolean;
  cv: string;
  cvFileName: string;
}

function formatApplicationMessage(data: ApplicationData): string {
  const remoteLabels: Record<string, string> = {
    full: '100% Remote',
    hybrid: 'Hybrid',
    office: 'Office',
  };

  return `
🎯 <b>NOUVELLE CANDIDATURE HACKBOOT</b>
━━━━━━━━━━━━━━━━━━━━━━

👤 <b>INFORMATIONS PERSONNELLES</b>
• Nom complet: ${data.firstName} ${data.lastName}
• Email: ${data.email}
• Téléphone: ${data.phone || 'Non renseigné'}
• Localisation: ${data.location || 'Non renseignée'}

💼 <b>POSTE VISÉ</b>
• Position: ${data.position}
• Département: ${data.department || 'Non spécifié'}
• Disponibilité: ${data.startDate || 'Non précisée'}

💰 <b>PRÉTENTIONS SALARIALES</b>
${data.salary}

🏠 <b>PRÉFÉRENCE DE TRAVAIL</b>
${remoteLabels[data.remote] || data.remote}

📝 <b>LETTRE DE MOTIVATION</b>
${data.motivation}

🔗 <b>PORTFOLIO / LIENS</b>
${data.portfolio || 'Non renseigné'}

📅 <b>DISPONIBILITÉ POUR ENTRETIEN</b>
${data.availability || 'Non précisée'}

💬 <b>MESSAGE / QUESTIONS</b>
${data.message || 'Aucun message supplémentaire'}

📋 <b>CONSENTEMENTS</b>
• RGPD: ${data.gdpr ? '✅ Accepté' : '❌ Refusé'}
• Newsletter: ${data.newsletter ? '✅ Oui' : '❌ Non'}

📎 <b>CV</b>
Fichier: ${data.cvFileName}
(Le CV sera envoyé dans un message séparé)
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}

async function sendToTelegram(message: string): Promise<void> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Telegram API error:', error);
    throw new Error('Failed to send message to Telegram');
  }
}

async function sendCvToTelegram(cvBase64: string, fileName: string): Promise<void> {
  const base64Data = cvBase64.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('document', new Blob([buffer], { type: 'application/pdf' }), fileName);
  formData.append('caption', `📄 CV de candidature: ${fileName}`);

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Telegram API error (CV):', error);
    throw new Error('Failed to send CV to Telegram');
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ApplicationData = await request.json();

    if (!data.firstName || !data.lastName || !data.email || !data.position || !data.motivation || !data.salary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!data.gdpr) {
      return NextResponse.json(
        { error: 'GDPR consent is required' },
        { status: 400 }
      );
    }

    if (!data.cv) {
      return NextResponse.json(
        { error: 'CV is required' },
        { status: 400 }
      );
    }

    const message = formatApplicationMessage(data);
    await sendToTelegram(message);

    await sendCvToTelegram(data.cv, data.cvFileName);

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
