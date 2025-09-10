import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || 'noreply@fti.or.th';
const FROM_NAME = process.env.MAIL_FROM_NAME || 'FTI-TIPMSE';

let mailer;

function getMailer() {
  if (!mailer) {
    const { MAILERSEND_API_KEY } = process.env;
    if (!MAILERSEND_API_KEY) {
      throw new Error('Missing MAILERSEND_API_KEY in environment');
    }
    mailer = new MailerSend({ apiKey: MAILERSEND_API_KEY });
  }
  return mailer;
}

export async function sendRegistrationEmail({ toEmail, toName, code }) {
  const mailer = getMailer();

  const sentFrom = new Sender(FROM_EMAIL, FROM_NAME);
  const recipients = [new Recipient(toEmail, toName || toEmail)];

  const subject = 'ยืนยันการลงทะเบียนเข้าร่วมงาน EPR โดย TIPMSE & FTI';
  const text = `เรียนคุณ ${toName || ''}\n\n` +
    `ขอบคุณสำหรับการลงทะเบียนเข้าร่วมงาน EPR โดย TIPMSE & FTI\n` +
    `รหัสผู้ลงทะเบียนของคุณ: ${code}\n\n` +
    `หากมีคำถามเพิ่มเติม สามารถติดต่อทีมงานได้ทางอีเมลนี้\n\n` +
    `ขอแสดงความนับถือ\nทีมงาน TIPMSE & FTI`;
  const html = `
    <div style="font-family:Prompt,Arial,Helvetica,sans-serif; line-height:1.6; color:#111">
      <p>เรียนคุณ ${toName || ''}</p>
      <p>ขอบคุณสำหรับการลงทะเบียนเข้าร่วมงาน <strong>EPR โดย TIPMSE & FTI</strong></p>
      <p>รหัสผู้ลงทะเบียนของคุณ: <strong>${code}</strong></p>
      <p>หากมีคำถามเพิ่มเติม สามารถติดต่อทีมงานได้ทางอีเมลนี้</p>
      <p>ขอแสดงความนับถือ<br/>ทีมงาน TIPMSE & FTI</p>
    </div>
  `;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setText(text)
    .setHtml(html);

  await mailer.email.send(emailParams);
}
