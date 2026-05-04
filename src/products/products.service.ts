import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  create() {
    return 'Creando un Producto';
  }
}
