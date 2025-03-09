import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import * as nodemailer from 'nodemailer';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  private transporter;

  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private rolesService: RolesService,
    private jwtService: JwtService,
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

  async validateUser(
    email: string,
    pass: string,
    tenantName?: string,
  ): Promise<Omit<User, 'password'> | null> {
    let tenantId: number | undefined;
    if (tenantName) {
      const tenant = await this.tenantsService.findByName(tenantName);
      if (!tenant)
        throw new BadRequestException(`Tenant '${tenantName}' does not exist`);
      tenantId = tenant.id;
    }
    const user = await this.usersService.findByEmail(email, tenantId);
    if (user && (await user.validatePassword(pass))) {
      if (
        tenantName &&
        user.tenant?.name !== tenantName &&
        user.tenantId !== null
      ) {
        throw new UnauthorizedException('User does not belong to this tenant');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result }: any = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, tenantName?: string) {
    const user = await this.validateUser(
      loginDto.email,
      loginDto.password,
      tenantName,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      tenantName,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto, tenantName?: string) {
    let tenant: any = null;
    if (tenantName) {
      tenant = await this.tenantsService.findByName(tenantName);
      if (!tenant) {
        throw new BadRequestException(`Tenant '${tenantName}' does not exist`);
      }
    } else {
      throw new BadRequestException('Tenant name is required');
    }

    const tenantId = tenant?.id;
    const defaultRole = await this.rolesService.findByName('user', tenantId);
    if (!defaultRole) {
      throw new BadRequestException(
        `Default role 'user' does not exist for tenant '${tenantName}'`,
      );
    }

    const user = await this.usersService.create({
      ...registerDto,
      tenant,
      roles: [defaultRole],
    });
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      tenantName,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendPasswordResetLink(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const token = this.jwtService.sign({ email }, { expiresIn: '15m' });
    await this.transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `Click here to reset your password: http://localhost:3000/auth/reset-password?token=${token}`,
    });
    return { message: 'Reset link sent' };
  }

  async resetPassword(resetDto: ResetPasswordDto) {
    const { token, newPassword } = resetDto;
    const decoded = this.jwtService.verify(token);
    const user = await this.usersService.findByEmail(decoded.email);
    if (!user) throw new UnauthorizedException('Invalid token');
    return this.usersService.update(
      user.id,
      { password: newPassword },
      user.tenantId,
    );
  }

  async loginSocial(
    profile: any,
    provider: string = 'unknown',
    tenantName?: string,
  ) {
    let tenantId: any;
    if (tenantName) {
      const tenant = await this.tenantsService.findByName(tenantName);
      if (!tenant)
        throw new BadRequestException(`Tenant '${tenantName}' does not exist`);
      tenantId = tenant.id;
    }
    const user = await this.usersService.createOrUpdateSocialUser(
      profile,
      provider,
      tenantId,
    );
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      tenantName,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async loginLdap(user: any, tenantName?: string) {
    let tenantId: any;
    if (tenantName) {
      const tenant = await this.tenantsService.findByName(tenantName);
      if (!tenant)
        throw new BadRequestException(`Tenant '${tenantName}' does not exist`);
      tenantId = tenant.id;
    }

    const email = user.mail || `${user.uid}@example.com`; // Tùy thuộc vào cấu hình LDAP
    let existingUser = await this.usersService.findByEmail(email, tenantId);

    if (!existingUser) {
      const defaultRole = await this.rolesService.findByName('user', tenantId);
      if (!defaultRole) {
        throw new BadRequestException(
          `Default role 'user' does not exist for tenant '${tenantName}'`,
        );
      }
      existingUser = await this.usersService.create({
        email,
        password: 'ldap_user_no_password', // Không cần password cho LDAP
        tenant: tenantId ? ({ id: tenantId } as any) : null,
        roles: [defaultRole],
        provider: 'ldap',
        providerId: user.uid,
      });
    }

    const payload = {
      email: existingUser.email,
      sub: existingUser.id,
      tenantId: existingUser.tenantId,
      tenantName,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
