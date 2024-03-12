import { Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException, NotImplementedException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// npm install @prisma/client @prisma/client
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationArgsDto } from 'src/common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Product service');

  onModuleInit() {
    this.$connect();
    this.logger.log(`Database is connected on products...`)
  }
  async create(createProductDto: CreateProductDto): Promise<CreateProductDto> {
    return this.product.create({
      data: createProductDto
    })
  }

  async findAll({ limit, page }: PaginationArgsDto) {

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);


    return {
      meta: {
        tota: totalPages,
        page: page,
        lastPage: lastPage,
      },
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
        // where: { available: true }
      })
    }

  }

  async findOne(id: number, msg?: string) {

    const product = await this.product.findFirst({
      where: { id, available: true }
    });

    if (!product) throw new NotImplementedException(msg ?? 'Product not found');
    return product;

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);

    const product = await this.product.update({

      where: { id },
      data: data,

    })

    return product;


  }

  async remove(id: number) {
    const oldProduct = await this.findOne(id, 'Record to update not found.');

    try {

      await this.product.update({
        where: { id, available: true },
        data: { available: false }
      })

      // if (!product.available) throw new NotFoundException('Record to update not found.')
      // if (!product.available) throw { code: 'P2025', meta: { cause: 'Record to update not found.5' } }

      delete oldProduct.available;
      return oldProduct;
    } catch (error) {
      console.log({ error })

      if (error.code === 'P2025') {
        throw new NotAcceptableException(error.meta.cause)
        // throw new NotAcceptableException('No pudimos processar to requerimiento.')
      }
      throw new InternalServerErrorException('Lo sentimos, ha ocurrido un problema interno, por ahora no podemos processar su solicitud.')

    }
  }


}
