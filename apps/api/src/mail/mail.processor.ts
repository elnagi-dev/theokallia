import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

// Job data shapes
interface OtpJobData {
  email: string
  otp: string
}

// Processes all jobs on the 'mail' queue
// BullMQ automatically retries failed jobs with backoff
@Processor('mail')
export class MailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter

  constructor(private config: ConfigService) {
    super()
    // Create Nodemailer transporter using SMTP config from .env
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    })
  }

  // Routes jobs to the correct handler based on job name
  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'send-otp':
        await this.handleSendOtp(job as Job<OtpJobData>)
        break
      default:
        throw new Error(`Unknown job name: ${job.name}`)
    }
  }

  // Sends OTP verification email
  // If this throws, BullMQ will retry automatically
  private async handleSendOtp(job: Job<OtpJobData>): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: job.data.email,
      subject: 'Your Theokallia verification code',
      html: `
        <div style="font-family: serif; max-width: 480px; margin: 0 auto;">
          <h2 style="letter-spacing: 0.2em;">THEOKALLIA</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 0.5em; color: #7E22CE;">${job.data.otp}</h1>
          <p>This code expires in 5 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    })
  }
}