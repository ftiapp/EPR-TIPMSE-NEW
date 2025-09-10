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
    let message = `เรียน ${name}\n`;
    message += `ผู้เข้าร่วมประเภท ${getParticipantTypeInThai(participantType)}\n`;
    
    if (organization) {
      message += `องค์กร ${organization}\n`;
    }
    
    message += `ท่านได้ทำการลงทะเบียนเข้าร่วมงาน "รวมพลังขับเคลื่อน EPR เปลี่ยนบรรจุภัณฑ์ให้เป็นวัตถุดิบ" สำเร็จแล้ว `;
    message += `ท่านสามารถตรวจสอบบัตรเข้างานได้ที่ ${baseUrl}/ticket/${uuid}`;
    
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

// Helper function to convert participant type to Thai
function getParticipantTypeInThai(type) {
  const types = {
    'participant': 'ผู้เข้าร่วมงาน',
    'speaker': 'วิทยากร',
    'executive': 'ผู้บริหาร'
  };
  
  return types[type] || 'ผู้เข้าร่วมงาน';
}

export default { sendRegistrationSMS };
