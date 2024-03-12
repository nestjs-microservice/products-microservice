import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationArgsDto } from 'src/common/dto';
import { MessagePattern, Payload } from '@nestjs/microservices';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  async create(
    @Payload() createProductDto: CreateProductDto
  ) {

    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all' })
  async findAll(
    @Payload() paginationArgsDto: PaginationArgsDto
  ) {

    return await this.productsService.findAll(paginationArgsDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  async findOne(@Payload('id', ParseIntPipe) id: number) {

    return await this.productsService.findOne(id);

  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  async update(
    // @Payload('id', ParseIntPipe) id: number,
    // @Body() updateProductDto: UpdateProductDto
    @Payload() updateProductDto: UpdateProductDto
  ) {
    return await this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  async remove(@Payload('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}
