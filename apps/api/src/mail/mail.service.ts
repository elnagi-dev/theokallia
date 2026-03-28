import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

@Injectable()
export class MailService {
  constructor(
    // Inject the BullMQ mail queue
    @InjectQueue('mail') private readonly mailQueue: Queue,
  ) {}

  // Push an OTP email job to the queue
  // BullMQ worker picks it up in the background and sends the email
  // If sending fails, BullMQ retries automatically up to 3 times
  async sendOtp(email: string, otp: string): Promise<void> {
    await this.mailQueue.add(
      'send-otp',
      { email, otp },
      {
        attempts: 3,
        backoff: {
          // Wait 5 seconds before first retry, doubles on each attempt
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    )
  }
}