// SMS service for sending registration confirmations
const SMS_CONFIG = {
  user: process.env.SMS_USER || 'FTITransaction',
  pass: process.env.SMS_PASS || 'uu%23bEy8J',
  type: '5', // Thai language
  from: process.env.SMS_FROM || 'FTIoffice',
  serviceId: process.env.SMS_SERVICE_ID || 'FTI002',
  apiUrl: process.env.SMS_API_URL || 'https://www.etracker.cc/bulksms/mesapi.aspx'
};

// Function to convert Thai text to HEX encoding
function thaiToHex(text) {
  return Buffer.from(text, 'utf8').toString('hex').toUpperCase();
}

// Ensure addressee always uses 'คุณ <first> <last>' and strips any provided titles
function normalizeAddressee(name) {
  const raw = (name || '').toString().trim();
  if (!raw) return 'คุณ';
  // Strip common Thai/English titles at the start
  const withoutTitle = raw.replace(/^(คุณ|นาย|นางสาว|นาง|ดร\.?|ดร|Mr\.?|Mrs\.?|Ms\.?)\s*/i, '');
  return `คุณ ${withoutTitle}`.trim();
}

// Function to format phone number to international format
function formatPhoneNumber(phone) {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, replace with 66
  if (cleaned.startsWith('0')) {
    return '66' + cleaned.substring(1);
  }
  
  // If already starts with 66, return as is
  if (cleaned.startsWith('66')) {
    return cleaned;
  }
  
  // Otherwise, assume it's a local number and add 66
  return '66' + cleaned;
}

export async function sendRegistrationSMS({ phoneNumber, name, participantType, organization, uuid }) {
  try {
    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Create Thai message
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const ticketUrl = `${baseUrl.replace(/\/$/, '')}/ticket/${uuid}`;
    let message = `เรียน ${normalizeAddressee(name)}`;
    message += `\nประเภทผู้เข้าร่วม ${getParticipantTypeInThai(participantType)}`;
    message += `\nท่านสามารถตรวจสอบตั๋วได้ที่`;
    message += `\n${ticketUrl}`;
    
    // Encoding strategy for Thai: controlled by env SMS_THAI_MODE (HEX | RAW)
    // - HEX: Convert TH->HEX (commonly required by providers for type=5)
    // - RAW: Send UTF-8 Thai with normal URL encoding
    const thaiMode = (process.env.SMS_THAI_MODE || 'HEX').toUpperCase();
    const useRawThai = thaiMode === 'RAW';
    const hexMessage = useRawThai ? null : thaiToHex(message);
    
    // Build API URL manually to avoid double-encoding of password ('%23' should remain as '%23')
    const enc = encodeURIComponent;
    const apiUrl = `${SMS_CONFIG.apiUrl}`
      + `?user=${enc(SMS_CONFIG.user)}`
      + `&pass=${SMS_CONFIG.pass}` // DO NOT encode again; keep as provided in .env
      + `&type=${enc(SMS_CONFIG.type)}`
      + `&to=${enc(formattedPhone)}`
      + `&from=${enc(SMS_CONFIG.from)}`
      + `&text=${enc(useRawThai ? message : hexMessage)}`
      + `&servid=${enc(SMS_CONFIG.serviceId)}`;
    
    // Log SMS details for debugging
    console.log('=== SMS DEBUG INFO ===');
    console.log('Phone (original):', phoneNumber);
    console.log('Phone (formatted):', formattedPhone);
    console.log('Message (original):', message);
    console.log('Thai mode:', useRawThai ? 'RAW (no HEX)' : 'HEX');
    if (!useRawThai) console.log('Message (HEX):', hexMessage);
    console.log('Full SMS URL:', apiUrl);
    console.log('SMS Config:', SMS_CONFIG);
    console.log('======================');
    
    // Send SMS
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'FTI-TIPMSE-Registration/1.0'
      }
    });
    
    const result = await response.text();
    
    // Log response for debugging
    console.log('SMS API Response Status:', response.status);
    console.log('SMS API Response Body:', result);
    
    // Check if SMS was sent successfully
    // The API typically returns a message ID or success indicator
    if (response.ok && result) {
      console.log('SMS sent successfully:', result);
      return { success: true, messageId: result.trim() };
    } else {
      console.error('SMS sending failed:', result);
      return { success: false, error: result };
    }
    
  } catch (error) {
    console.error('SMS service error:', error);
    return { success: false, error: error.message };
  }
}

// Reminder template SMS
export async function sendReminderSMS({ phoneNumber, name, participantType, uuid }) {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const ticketUrl = `${baseUrl.replace(/\/$/, '')}/ticket/${uuid}`;

    // ตามข้อความที่คุณต้องการ
    let message = 'Reminder: รวมพลังขับเคลื่อน EPR เปลี่ยนบรรจุภัณฑ์ให้เป็นวัตถุดิบ';
    message += `\nเรียน ${normalizeAddressee(name)}`;
    message += `\nประเภทผู้เข้าร่วม ${getParticipantTypeInThai(participantType)}`;
    message += `\nวันที่: 30 กันยายน 2568 เวลา 9.00 - 12.00 น.`;
    message += `\nตั๋วของท่าน: ${ticketUrl}`;

    const thaiMode = (process.env.SMS_THAI_MODE || 'HEX').toUpperCase();
    const useRawThai = thaiMode === 'RAW';
    const hexMessage = useRawThai ? null : thaiToHex(message);

    const enc = encodeURIComponent;
    const apiUrl = `${SMS_CONFIG.apiUrl}`
      + `?user=${enc(SMS_CONFIG.user)}`
      + `&pass=${SMS_CONFIG.pass}`
      + `&type=${enc(SMS_CONFIG.type)}`
      + `&to=${enc(formattedPhone)}`
      + `&from=${enc(SMS_CONFIG.from)}`
      + `&text=${enc(useRawThai ? message : hexMessage)}`
      + `&servid=${enc(SMS_CONFIG.serviceId)}`;

    const response = await fetch(apiUrl, { method: 'GET', headers: { 'User-Agent': 'FTI-TIPMSE-Registration/1.0' } });
    const result = await response.text();
    if (response.ok && result) return { success: true, messageId: result.trim() };
    return { success: false, error: result };
  } catch (error) {
    console.error('Reminder SMS error:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to convert participant type to Thai
function getParticipantTypeInThai(type) {
  const types = {
    'participant': 'ผู้เข้าร่วมงาน',
    'speaker': 'วิทยากร',
    'executive': 'ผู้บริหาร'
  };
  
  return types[type] || 'ผู้เข้าร่วมงาน';
}

export default { sendRegistrationSMS, sendReminderSMS };
