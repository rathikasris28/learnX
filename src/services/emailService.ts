export interface VerificationEmailRequest {
  recipient: string;
  code: string;
  expiresInMinutes: number;
}

export interface EmailService {
  sendVerificationCode(request: VerificationEmailRequest): Promise<void>;
}

/** Replace this adapter with a backend call to Resend, Nodemailer, Firebase, or Supabase. */
export const mockEmailService: EmailService = {
  async sendVerificationCode({ recipient, code, expiresInMinutes }) {
    console.info(`[LearnX mock email] Verification code for ${recipient}: ${code} (expires in ${expiresInMinutes} minutes)`);
  }
};
