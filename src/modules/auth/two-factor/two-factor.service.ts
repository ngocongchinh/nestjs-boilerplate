import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as speakeasy from 'speakeasy';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorService {
  private transporter;

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async generateTwoFactorSecret(
    userId: number,
    tenantId: number,
  ): Promise<string> {
    const secret = speakeasy.generateSecret({ length: 20 });
    const user = await this.usersService.findOne(userId, tenantId);
    if (!user) throw new Error('User not found');
    user.two_factor_secret = secret.base32;
    user.is_two_factor_enabled = true;
    await this.usersService.update(
      userId,
      { twoFactorSecret: secret.base32, isTwoFactorEnabled: true },
      tenantId,
    );
    return secret.otpauth_url;
  }

  async verifyTwoFactorToken(
    userId: number,
    token: string,
    tenantId: number,
  ): Promise<boolean> {
    const user = await this.usersService.findOne(userId, tenantId);
    if (!user || !user.two_factor_secret) throw new Error('2FA not enabled');
    return speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token,
    });
  }

  async sendTwoFactorEmail(userId: number, tenantId: number) {
    const user = await this.usersService.findOne(userId, tenantId);
    if (!user || !user.two_factor_secret) throw new Error('2FA not enabled');
    const token = speakeasy.totp({
      secret: user.two_factor_secret,
      encoding: 'base32',
    });
    await this.transporter.sendMail({
      to: user.email,
      subject: 'Your 2FA Code',
      text: `Your 2FA code is: ${token}`,
    });
    return { message: '2FA code sent to email' };
  }
}
