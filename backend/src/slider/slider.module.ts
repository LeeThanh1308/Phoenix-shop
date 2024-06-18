import { Module } from '@nestjs/common';
import { SliderService } from './slider.service';
import { SliderController } from './slider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slider } from './entities/slider.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Accounts } from 'src/accounts/entities/account.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Slider, Accounts]),
    MulterModule.register({
      storage: diskStorage({
        destination: './public/sliders',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const newname = file.originalname
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
          cb(null, `${newname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedFiles = ['.jpg', '.png', '.jpeg'];
        if (!allowedFiles.includes(ext)) {
          req.fileValidator = 'Image is not a valid.';
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['Content-Length']);
          if (fileSize > 1024 * 1024 * 2) {
            req.fileValidator = 'Kích thước file tối da 2mb';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
    AuthModule,
    JwtModule,
  ],
  controllers: [SliderController],
  providers: [SliderService],
})
export class SliderModule {}
