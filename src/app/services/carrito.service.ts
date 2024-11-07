import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: any[] = [];

  constructor() {}

  // Agregar producto al carrito
  agregarAlCarrito(producto: any, cantidad: number) {
    const productoExistente = this.carrito.find(item => item.iddona === producto.iddona);
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      this.carrito.push({ ...producto, cantidad });
    }
  }

  // Obtener productos del carrito
  obtenerCarrito() {
    return [...this.carrito];
  }

  // Vaciar el carrito
  vaciarCarrito() {
    this.carrito = [];
  }

  // Calcular el total del carrito
  calcularTotal() {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }
}
