/**
 * @fileoverview Validaciones de formularios del panel, alineadas con las del backend
 * (`CreateProductRequest`/`UpdateProductRequest`, `CreateCategoryRequest`). Evitan viajes al servidor con
 * datos que igual serían rechazados; el backend sigue validando (regla 7).
 */

/**
 * Valida el formulario de producto.
 *
 * @param {{ name: string, description: string, price: string, stock: string, categoryId: string }} form - Valores del formulario (texto)
 * @returns {Object<string, string>} Errores por campo; vacío si es válido
 */
export function validateProduct(form) {
  const errors = {};
  const price = Number(form.price);
  const stock = Number(form.stock);

  if (!form.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (!form.description.trim()) errors.description = 'La descripción es obligatoria.';
  if (form.price === '' || !Number.isFinite(price) || price <= 0) errors.price = 'El precio debe ser mayor que 0.';
  if (form.stock === '' || !Number.isInteger(stock) || stock < 0) errors.stock = 'El stock debe ser un entero mayor o igual a 0.';
  if (!form.categoryId) errors.categoryId = 'Elige una categoría.';

  return errors;
}

/**
 * Valida el nombre de una categoría, incluida la unicidad contra las existentes (sin distinguir mayúsculas).
 *
 * @param {string} name - Nombre propuesto
 * @param {Array<{ id: string, name: string }>} categories - Categorías existentes
 * @param {string} [currentId] - Categoría que se está editando (se excluye de la comparación)
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateCategoryName(name, categories, currentId) {
  const trimmed = name.trim();
  if (!trimmed) return 'El nombre es obligatorio.';

  const duplicated = categories.some(
    category => category.id !== currentId && category.name.toLowerCase() === trimmed.toLowerCase(),
  );
  return duplicated ? 'Ya existe una categoría con ese nombre.' : null;
}
