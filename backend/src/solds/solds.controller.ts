import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SoldsService } from './solds.service';
import { CreateSoldDto } from './dto/create-sold.dto';
import { UpdateSoldDto } from './dto/update-sold.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('solds')
export class SoldsController {
  constructor(private readonly soldsService: SoldsService) {}

  @Post()
  async create(@Req() req: any, @Body() createSoldDto: CreateSoldDto) {
    const user = req.user;
    return await this.soldsService.create(createSoldDto, user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    const user = req.user;
    return this.soldsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soldsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSoldDto: UpdateSoldDto) {
    return this.soldsService.update(+id, updateSoldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soldsService.remove(+id);
  }
}
