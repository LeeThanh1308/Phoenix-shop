import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Accounts } from 'src/accounts/entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Accounts, Category]),
    MulterModule.register({
      storage: diskStorage({
        destination: './public/products',
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
        // console.log(file);
        const ext = extname(file.originalname);
        const allowedFiles = ['.jpg', '.png', '.jpeg'];
        if (!allowedFiles.includes(ext)) {
          req.fileValidator = 'Image is not a valid.';
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['Content-Length']);
          if (fileSize > 1024 * 1024 * 10) {
            req.fileValidator = 'Kích thước file tối da 2mb';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),

    JwtModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
