import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

interface LinkJobData {
  email: string
  url: string
}

// Processes all jobs on the 'mail' queue
// BullMQ automatically retries failed jobs with backoff
@Processor('mail')
export class MailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter
  private readonly logger = new Logger(MailProcessor.name)

  constructor(private config: ConfigService) {
    super()
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    })
  }

  async process(job: Job): Promise<void> {
      this.logger.log(`Processing job: ${job.name}`)
      try {
        switch (job.name) {
          case 'send-verification-email':
            await this.handleSendVerificationEmail(job as Job<LinkJobData>)
            break
          case 'send-reset-password':
            await this.handleSendResetPassword(job as Job<LinkJobData>)
            break
          default:
            throw new Error(`Unknown job name: ${job.name}`)
        }
      this.logger.log(`Job ${job.name} completed successfully`)
    } catch (err) {
      this.logger.error(`Job ${job.name} failed:`, err)
      throw err
    }
  }

  private async handleSendVerificationEmail(
    job: Job<LinkJobData>,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: job.data.email,
      subject: 'Verify your Theokallia email',
      html: `
        <div style="font-family: serif; max-width: 480px; margin: 0 auto;">
          <h2 style="letter-spacing: 0.2em;">THEOKALLIA</h2>
          <p>Click the link below to verify your email address:</p>
          <a href="${job.data.url}" style="color: #7E22CE;">Verify my email</a>
          <p>This link expires in 1 hour.</p>
          <p>If you did not create an account, please ignore this email.</p>
        </div>
      `,
    })
  }

  private async handleSendResetPassword(job: Job<LinkJobData>): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: job.data.email,
      subject: 'Reset your Theokallia password',
      html: `
        <div style="font-family: serif; max-width: 480px; margin: 0 auto;">
          <h2 style="letter-spacing: 0.2em;">THEOKALLIA</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${job.data.url}" style="color: #7E22CE;">Reset my password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    })
  }
}
