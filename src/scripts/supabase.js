/**
 * supabase.js - Supabase Client & Bulletproof Data Handling with LocalStorage Fail-Safe
 */
import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Kiểm tra xem cấu hình đã sẵn sàng chưa
export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Lưu phản hồi của cô ấy vào bảng `replies`
 * @param {Object} data - { choice, message, senderName }
 */
export async function saveResponse({ choice, message, senderName }) {
  const deviceInfo = `${navigator.userAgent} (${window.innerWidth}x${window.innerHeight})`;

  const payload = {
    choice: choice || 'yes',
    message: message || '',
    sender_name: senderName || 'Bé Bống',
    device_info: deviceInfo,
    created_at: new Date().toISOString()
  };

  // 1. Luôn sao lưu an toàn vào localStorage trước để không bao giờ bị mất tin nhắn của nàng
  try {
    const backupList = JSON.parse(localStorage.getItem('romantic_replies_backup') || '[]');
    backupList.push(payload);
    localStorage.setItem('romantic_replies_backup', JSON.stringify(backupList));
    console.log('Đã sao lưu phản hồi vào localStorage backup:', payload);
  } catch (e) {
    console.warn('LocalStorage backup error:', e);
  }

  // 2. Nếu chưa cấu hình Supabase thực tế, mô phỏng delay gửi thành công
  if (!isConfigured || !supabase) {
    console.warn('⚠️ Supabase chưa được cấu hình. Dữ liệu đã lưu trữ an toàn trong localStorage:', payload);
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, mocked: true };
  }

  // 3. Thử lưu lên Supabase Cloud
  try {
    const { data, error } = await supabase
      .from('replies')
      .insert([{
        choice: payload.choice,
        message: payload.message,
        sender_name: payload.sender_name,
        device_info: payload.device_info
      }]);

    if (error) {
      console.warn('Supabase warning (đã lưu dự phòng an toàn):', error);
      // Giữ trải nghiệm lãng mạn trọn vẹn cho nàng: không ngắt quãng trải nghiệm bằng popup lỗi
      return { success: true, savedLocally: true, error };
    }

    return { success: true, data };
  } catch (err) {
    console.warn('Supabase network error (đã lưu dự phòng an toàn):', err);
    return { success: true, savedLocally: true, error: err };
  }
}
