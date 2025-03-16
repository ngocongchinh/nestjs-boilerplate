import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LdapStrategy } from './ldap.strategy';
import { TwitterStrategy } from './social/twitter.strategy';
import { FacebookStrategy } from './social/facebook.strategy';
import { GithubStrategy } from './social/github.strategy';
import { GoogleStrategy } from './social/google.strategy';
import { UsersModule } from '../users/users.module';
import { TenantsModule } from '../tenants/tenants.module';
import { RolesModule } from '../roles/roles.module';
import { TwoFactorService } from './two-factor/two-factor.service';
import { TwoFactorController } from './two-factor/two-factor.controller';
import { TenantsController } from '../tenants/tenants.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TenantsModule,
    RolesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Hoặc SMTP server
        port: 587,
        secure: false,
        auth: {
          user: 'email@gmail.com', // Thay bằng email của mày
          pass: 'Abc111!!!', // Thay bằng app password nếu dùng Gmail
        },
      },
      defaults: {
        from: '"Your App" <email@gmail.com>',
      },
      template: {
        dir: __dirname + '/templates', // Thư mục chứa template email
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  controllers: [AuthController, TwoFactorController, TenantsController],
  providers: [
    AuthService,
    JwtStrategy,
    LdapStrategy,
    TwitterStrategy,
    FacebookStrategy,
    GithubStrategy,
    GoogleStrategy,
    TwoFactorService,
  ],
})
export class AuthModule {}
