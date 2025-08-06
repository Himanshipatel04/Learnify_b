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

    case 'approveMentor':
      return {
        subject: 'Congratulations! Your Mentorship Request at Learnify is Accepted!',
        html: `
          <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px #e0e0e0;">
              <h2 style="color: #2e7d32;">🎉 Congratulations!</h2>
              <p>Hi <strong>${data.name}</strong>,</p>
              <p>We’re excited to let you know that your request to become a mentor on <strong>Learnify</strong> has been <span style="color: #2e7d32;"><strong>approved</strong></span>.</p>
              <p>You can now start guiding and collaborating with students on exciting projects.</p>
              <p>Thank you for your willingness to contribute to the community.</p>
              <p style="margin-top: 30px;">– Learnify Team</p>
            </div>
          </div>
        `
      };

    case 'rejectMentor':
      return {
        subject: 'Your Mentorship Request at Learnify',
        html: `
          <div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px #e0e0e0;">
              <h2 style="color: #d32f2f;">Mentorship Request Update</h2>
              <p>Hi <strong>${data.name}</strong>,</p>
              <p>Thank you for your interest in becoming a mentor on <strong>Learnify</strong>.</p>
              <p>Unfortunately, your request has been <span style="color: #d32f2f;"><strong>rejected</strong></span>.</p>
              <p>We appreciate your willingness to contribute and encourage you to apply again in the future.</p>
              <p style="margin-top: 30px;">– Learnify Team</p>
            </div>
          </div>
        `
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