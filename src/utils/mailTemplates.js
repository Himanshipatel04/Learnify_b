export const getTemplate = (templateName, data) => {
  switch (templateName) {
    case 'projectUpload':
      return {
        subject: 'Your Project Was Uploaded!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Hello ${data.name},</h2>
            <p>Your project <strong>${data.projectTitle}</strong> has been successfully uploaded to <b>Learnify</b>.</p>
            <p>Thank you for contributing and inspiring the community!</p>
            <br/>
            <p>— The Learnify Team</p>
          </div>
        `,
      };

    case 'welcome':
      return {
        subject: 'Welcome to Learnify!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Welcome, ${data.name}!</h2>
            <p>We’re excited to have you on board. Start exploring and sharing amazing projects today.</p>
            <a href="https://learnify.example.com" style="color: #1a73e8;">Go to Learnify</a>
            <br/><br/>
            <p>— Team Learnify</p>
          </div>
        `,
      };

    case 'passwordReset':
      return {
        subject: 'Reset Your Password',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Hi ${data.name},</h2>
            <p>We received a request to reset your password.</p>
            <p><a href="${data.resetLink}" style="color: #1a73e8;">Click here to reset it</a></p>
            <p>If you didn’t request this, you can ignore this email.</p>
            <br/>
            <p>— Learnify Security Team</p>
          </div>
        `,
      };

    default:
      return {
        subject: 'Notification from Learnify',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <p>This is a default message. Please contact support if this was unexpected.</p>
          </div>
        `,
      };
  }
};