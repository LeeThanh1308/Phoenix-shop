import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Accounts } from './accounts/entities/account.entity';
import { VerificationsModule } from './verifications/verifications.module';
import { Verifications } from './verifications/entities/verification.entity';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { Roles } from './roles/entities/role.entity';
import { ProductsModule } from './products/products.module';
import { PremisesModule } from './premises/premises.module';
import { Premises } from './premises/entities/premises.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { Products } from './products/entities/product.entity';
import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/entities/cart.entity';
import { SliderModule } from './slider/slider.module';
import { Slider } from './slider/entities/slider.entity';
import { ProductsPremiseModule } from './products_premise/products_premise.module';
import { ProductsPremise } from './products_premise/entities/products_premise.entity';
import { ProductTypesModule } from './product_types/product_types.module';
import { ProductType } from './product_types/entities/product_type.entity';
import * as fs from 'fs';
import { join } from 'path';
import { SoldsModule } from './solds/solds.module';
import { DataVerifyModule } from './data_verify/data_verify.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        entities: [join(__dirname, './**/*.entity{.ts,.js}')],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: `smtps://${configService.get('MAIL_USER')}:${configService.get('MAIL_PASS')}@${configService.get('MAIL_HOST')}`,
        defaults: {
          from: '"Stores shop" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    AccountsModule,
    VerificationsModule,
    AuthModule,
    RolesModule,
    ProductsModule,
    PremisesModule,
    CategoriesModule,
    CartsModule,
    SliderModule,
    ProductsPremiseModule,
    ProductTypesModule,
    SoldsModule,
    DataVerifyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
