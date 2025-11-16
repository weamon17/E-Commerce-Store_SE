import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'httnotek27@gmail.com',
    pass: 'cjin onrg cnwv zzaq', 
  },
});

/**
 * Gửi email reset mật khẩu
 * @param {string} toEmail - Email của người nhận
 * @param {string} resetCode - Mã reset (ví dụ: 6 chữ số)
 */
export const sendPasswordResetEmail = async (toEmail, resetCode) => {
  // 2. Định nghĩa các tùy chọn email
  const mailOptions = {
    from: `"TechShop" <httnotek27@gmail.com>`, 
    to: toEmail, 
    subject: 'Yêu cầu đặt lại mật khẩu', 
    text: `Mã đặt lại mật khẩu của bạn là: ${resetCode}. Mã này sẽ hết hạn sau 10 phút.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Mã đặt lại mật khẩu của bạn là:</p>
        <h1 style="color: #0284c7; text-align: center; letter-spacing: 2px;">${resetCode}</h1>
        <p>Mã này sẽ hết hạn sau 10 phút.</p>
        <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
        <hr/>
        <p style="font-size: 0.9em; color: #777;">Trân trọng,<br/>Đội ngũ TechShop</p>
      </div>
    `, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    return { success: false, error: error.message };
  }
};