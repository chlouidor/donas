import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: any[] = [];

  constructor() {}


  agregarAlCarrito(producto: any, cantidad: number) {
    const productoExistente = this.carrito.find(item => item.iddona === producto.iddona);
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      this.carrito.push({ ...producto, cantidad });
    }
  }


  obtenerCarrito() {
    return [...this.carrito];
  }

  vaciarCarrito() {
    localStorage.removeItem('carrito');
    console.log('Carrito vaciado');
  }

  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }
}
