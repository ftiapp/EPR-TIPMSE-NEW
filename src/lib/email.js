import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import QRCode from 'qrcode';

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

// Helper to map participant type to Thai
function getParticipantTypeInThai(type) {
  const types = {
    participant: 'ผู้เข้าร่วมงาน',
    speaker: 'วิทยากร',
    executive: 'ผู้บริหาร',
  };
  return types[type] || 'ผู้เข้าร่วมงาน';
}

export async function sendRegistrationEmail({ 
  toEmail, 
  toName, 
  code, 
  participantType, 
  organization, 
  phoneNumber,
  title,
  firstName,
  lastName,
  department
}) {
  const mailer = getMailer();

  const sentFrom = new Sender(FROM_EMAIL, FROM_NAME);
  const recipients = [new Recipient(toEmail, toName || toEmail)];

  const subject = '🎫 การลงทะเบียนสำเร็จ - EPR Event by TIPMSE & FTI';
  const text = `เรียนคุณ ${toName || ''}\n\n` +
    `ขอบคุณสำหรับการลงทะเบียนเข้าร่วมงาน EPR โดย TIPMSE & FTI\n` +
    `รหัสผู้ลงทะเบียนของคุณ: ${code}\n\n` +
    `หากมีคำถามเพิ่มเติม สามารถติดต่อทีมงานได้ทางอีเมลนี้\n\n` +
    `ขอแสดงความนับถือ\nทีมงาน TIPMSE & FTI`;

  // Generate QR Code for email
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(code, {
      width: 256,
      margin: 2,
      color: {
        dark: '#059669',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('QR Code generation failed:', err);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // Prefer inline Data URL for QR (better reliability in many clients). Fallback to absolute URL.
  const qrImgSrc = qrCodeDataUrl || `${baseUrl}/api/qr/${code}`;
  
  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>การลงทะเบียนสำเร็จ</title>
  <style type="text/css">
    /* Reset styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    /* Base styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #f0f9ff 75%, #f1f5f9 100%);
      background-color: #f8fafc !important;
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
    }
    
    .email-container {
      max-width: 900px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #f0f9ff 75%, #f1f5f9 100%);
      background-color: #f8fafc;
    }
    
    .header-section {
      text-align: center;
      padding: 40px 20px 20px;
    }
    
    .header-text {
      font-size: 32px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 10px;
      line-height: 1.2;
    }
    
    .sub-header {
      font-size: 18px;
      color: #374151;
      margin-bottom: 30px;
      line-height: 1.4;
    }
    
    /* Modern ticket container */
    .ticket-container {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      overflow: hidden;
      margin: 20px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    /* Gradient header */
    .ticket-header {
      background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
      background-color: #10b981;
      color: white;
      text-align: center;
      padding: 30px 25px;
      position: relative;
      overflow: hidden;
    }
    
    .ticket-header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: shimmer 3s ease-in-out infinite alternate;
    }
    
    @keyframes shimmer {
      0% { opacity: 0.5; }
      100% { opacity: 0.8; }
    }
    
    .ticket-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
      position: relative;
      z-index: 2;
    }
    
    .ticket-date {
      font-size: 16px;
      margin-bottom: 8px;
      opacity: 0.95;
      position: relative;
      z-index: 2;
    }
    
    .ticket-venue {
      font-size: 14px;
      opacity: 0.9;
      position: relative;
      z-index: 2;
    }
    
    /* Main content table */
    .content-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    /* Modern QR Section */
    .qr-section {
      width: 280px;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #dcfce7 100%);
      background-color: #ecfdf5;
      text-align: center;
      padding: 35px 25px;
      vertical-align: top;
      border-right: 2px dashed #10b981;
      position: relative;
    }
    
    .qr-section::before {
      content: '';
      position: absolute;
      top: 20px;
      right: 20px;
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
      background-color: #10b981;
      border-radius: 50%;
      opacity: 0.3;
    }
    
    .qr-code-box {
      background: white;
      padding: 20px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 20px;
      border: 3px solid #10b981;
      box-shadow: 0 15px 30px rgba(16, 185, 129, 0.1);
    }
    
    .registration-badge {
      background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
      background-color: #10b981;
      color: white !important;
      padding: 12px 24px;
      border-radius: 30px;
      font-weight: bold;
      font-size: 16px;
      letter-spacing: 1px;
      margin: 15px 0;
      display: inline-block;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }
    
    .qr-instruction {
      font-size: 14px;
      color: #047857;
      background: rgba(16, 185, 129, 0.1);
      backdrop-filter: blur(5px);
      padding: 18px;
      border-radius: 16px;
      border: 1px solid rgba(16, 185, 129, 0.2);
      line-height: 1.6;
      margin-top: 20px;
    }
    
    /* Modern Details Section */
    .details-section {
      padding: 40px;
      vertical-align: top;
      background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(248,250,252,0.8) 100%);
      background-color: rgba(255,255,255,0.7);
    }
    
    .participant-header {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      background-color: #f8fafc;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 30px;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }
    
    .participant-name {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 8px;
    }
    
    .participant-email {
      font-size: 16px;
      color: #64748b;
    }
    
    /* Modern info items */
    .info-row {
      margin-bottom: 25px;
    }
    
    .info-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      display: block;
      font-weight: 600;
    }
    
    .info-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
      line-height: 1.5;
    }
    
    .participant-badge {
      background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
      background-color: #10b981;
      color: white !important;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: bold;
      display: inline-block;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    }
    
    .venue-box {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      background-color: #ecfdf5;
      padding: 20px;
      border-radius: 16px;
      border-left: 4px solid #10b981;
      margin-top: 12px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
    }
    
    /* Modern Footer */
    .ticket-footer {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      background-color: #f8fafc;
      padding: 35px 30px;
      text-align: center;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
    }
    
    .footer-text {
      color: #64748b;
      font-size: 16px;
      margin-bottom: 25px;
      line-height: 1.6;
    }
    
    .modern-button {
      background: linear-gradient(135deg, #10b981 0%, #0d9488 100%) !important;
      background-color: #10b981 !important;
      color: white !important;
      text-decoration: none !important;
      padding: 18px 40px !important;
      border-radius: 50px !important;
      font-weight: bold !important;
      font-size: 16px !important;
      display: inline-block !important;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3) !important;
      border: none !important;
      transition: all 0.3s ease !important;
      margin: 0 10px 15px 10px !important;
    }
    
    .modern-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4) !important;
    }
    
    .modern-button-secondary {
      background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
      background-color: #059669 !important;
      box-shadow: 0 10px 30px rgba(5, 150, 105, 0.3) !important;
    }
    
    .copyright {
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
      padding: 30px;
      background: rgba(255, 255, 255, 0.5);
    }
    
    /* Decorative elements */
    .decoration-dot {
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
      background-color: #10b981;
      border-radius: 50%;
      display: inline-block;
      margin: 0 4px;
      opacity: 0.6;
    }
    
    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .ticket-container {
        margin: 10px !important;
        border-radius: 16px !important;
      }
      
      .content-table {
        width: 100% !important;
      }
      
      .qr-section, .details-section {
        display: block !important;
        width: 100% !important;
        padding: 25px 20px !important;
      }
      
      .qr-section {
        border-right: none !important;
        border-bottom: 2px dashed #10b981 !important;
      }
      
      .participant-name {
        font-size: 22px !important;
      }
      
      .header-text {
        font-size: 28px !important;
      }
      
      .ticket-title {
        font-size: 24px !important;
      }
      
      .participant-header {
        padding: 20px !important;
      }
      
      .modern-button {
        display: block !important;
        margin: 10px 0 !important;
        width: calc(100% - 20px) !important;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #f0f9ff 75%, #f1f5f9 100%); background-color: #f8fafc;">
    <tr>
      <td align="center">
        <div class="email-container">
          <!-- Logo Header -->
          <div style="text-align: center; padding: 20px 0;">
            <a href="#" target="_blank" style="display: inline-block;">
              <img src="${baseUrl}/FTI-TIPMSE_RGB_forLightBG-01.png" alt="FTI-TIPMSE Logo" width="180" style="max-width: 100%; height: auto;">
            </a>
          </div>
          
          <!-- Modern Header -->
          <div class="header-section">
            <div class="header-text">
              การลงทะเบียนสำเร็จ
            </div>
            <div class="sub-header">
              ขอบคุณสำหรับการลงทะเบียน งาน EPR Event by TIPMSE & FTI
              <br>
              <span class="decoration-dot"></span>
              <span class="decoration-dot"></span>
              <span class="decoration-dot"></span>
            </div>
          </div>
          
          <!-- Modern Ticket Container -->
          <div class="ticket-container">
            <!-- Gradient Header -->
            <div class="ticket-header">
              <div class="ticket-title">EPR Event by TIPMSE & FTI</div>
              <div class="ticket-date">วันอังคารที่ 30 กันยายน 2568</div>
              <div class="ticket-venue">ห้องเพลนารีฮอล์ ชั้น 1 ศูนย์การประชุมแห่งชาติสิริกิติ์</div>
            </div>
            
            <!-- Main Content -->
            <table class="content-table" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Modern QR Section -->
                <td class="qr-section">
                  <div class="qr-code-box">
                    <img src="${qrImgSrc}" alt="QR Code" width="180" height="180" style="display: block;">
                  </div>
                  
                  <div class="registration-badge">${code}</div>
                  
                  <div class="qr-instruction">
                    <strong>🎫 วิธีใช้งาน</strong><br>
                    กรุณาแสดง QR Code นี้เมื่อลงทะเบียนเข้างาน หรือบันทึกรูปไว้ในมือถือ
                  </div>
                </td>
                
                <!-- Modern Details Section -->
                <td class="details-section">
                  <div class="participant-header">
                    <div class="participant-name">${title || ''}${firstName || ''} ${lastName || ''}</div>
                    <div class="participant-email">${toEmail}</div>
                  </div>
                  
                  <!-- Info Grid -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="50%" style="padding-right: 15px; vertical-align: top;">
                        <div class="info-row">
                          <span class="info-label">ผู้เข้าร่วมงาน</span>
                          <span class="info-value">${title || ''}${firstName || ''} ${lastName || ''}</span>
                        </div>
                      </td>
                      <td width="50%" style="padding-left: 15px; vertical-align: top;">
                        <div class="info-row">
                          <span class="info-label">ประเภทผู้เข้าร่วม</span>
                          <span class="participant-badge">${getParticipantTypeInThai(participantType)}</span>
                        </div>
                      </td>
                    </tr>
                    
                    ${typeof department !== 'undefined' && department ? `
                    <tr>
                      <td colspan="2" style="padding-top: 15px;">
                        <div class="info-row">
                          <span class="info-label">แผนก</span>
                          <span class="info-value">🏛️ ${department}</span>
                        </div>
                      </td>
                    </tr>` : ''}
                    
                    ${phoneNumber ? `
                    <tr>
                      <td colspan="2" style="padding-top: 15px;">
                        <div class="info-row">
                          <span class="info-label">เบอร์โทรศัพท์</span>
                          <span class="info-value">📞 ${phoneNumber}</span>
                        </div>
                      </td>
                    </tr>` : ''}
                    
                    <tr>
                      <td colspan="2" style="padding-top: 20px;">
                        <div class="info-row">
                          <span class="info-label">รายละเอียดงาน</span>
                          <div class="venue-box">
                            <span class="info-value">
                              📅 วันอังคารที่ 30 กันยายน 2568<br>
                              🕘 เวลา 09:00 – 12:00 น.<br>
                              📍 ห้องเพลนารีฮอล์ ชั้น 1<br>
                              ศูนย์การประชุมแห่งชาติสิริกิติ์
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Modern Footer -->
            <div class="ticket-footer">
              <div class="footer-text">
                🌟 สามารถดูรายละเอียดเพิ่มเติม ดาวน์โหลด QR Code และแชร์ตั๋วของคุณได้ที่ลิงก์ด้านล่าง
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center" style="padding: 0 5px;">
                    <a href="${baseUrl}/ticket/${code}" class="modern-button">
                      🎫 ดูตั๋วของฉัน
                    </a>
                  </td>
                  <td align="center" style="padding: 0 5px;">
                    <a href="https://epr-rdl3q.kinsta.app/#map" class="modern-button modern-button-secondary">
                      🗺️ แผนที่และเส้นทาง
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="copyright">
            © 2025 EPR Event by TIPMSE & FTI • สงวนลิขสิทธิ์ • 
            <span style="color: #f59e0b;">Made with 🧡 for sustainable industry</span>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setText(text)
    .setHtml(html);

  await mailer.email.send(emailParams);
}