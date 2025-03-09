import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { AuthService } from './auth.service';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private authService: AuthService) {
    super({
      server: {
        url: process.env.LDAP_URL!,
        bindDN: process.env.LDAP_BIND_DN,
        bindCredentials: process.env.LDAP_BIND_CREDENTIALS,
        searchBase: 'ou=users,dc=example,dc=com',
        searchFilter: '(uid={{username}})',
      },
    });
  }

  async validate(user: any, req: any): Promise<any> {
    const tenantName = req.query.tenant; // Lấy tenant từ query param
    const ldapUser = await this.authService.loginLdap(user, tenantName);
    return ldapUser;
  }
}
