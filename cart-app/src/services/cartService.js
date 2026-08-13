/**
 * @fileoverview Servicio mockeado para el carrito de compras.
 * Propósito: Simular llamadas a la API del carrito y devolver datos enriquecidos
 * visualmente para igualar el mockup, mientras se integra con el backend real.
 */

const MOCK_CART_DATA = {
  userId: "user-123",
  items: [
    {
      productId: "prod-1",
      name: "Camiseta Gráfica",
      variant: "Color: Negro, Talla: L",
      image: "https://via.placeholder.com/150",
      quantity: 1,
      price: 25.00
    },
    {
      productId: "prod-2",
      name: "Zapatillas Deportivas",
      variant: "Color: Blanco, Talla: 42",
      image: "https://via.placeholder.com/150",
      quantity: 1,
      price: 89.99
    }
  ],
  total: 114.99
};

/**
 * Obtiene el carrito actual del usuario.
 * @returns {Promise<Object>} Carrito mockeado enriquecido
 */
export async function getCart() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(MOCK_CART_DATA)));
    }, 500);
  });
}

/**
 * Actualiza la cantidad de un ítem en el carrito.
 * @param {string} productId - ID del producto
 * @param {number} quantity - Nueva cantidad
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function updateCartItem(productId, quantity) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, productId, quantity });
    }, 300);
  });
}

/**
 * Elimina un ítem del carrito.
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function removeCartItem(productId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, productId });
    }, 300);
  });
}
