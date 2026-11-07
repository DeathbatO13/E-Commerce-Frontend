import { useState } from 'react';
import { validateProduct } from '../utils/validation';

/**
 * Convierte un producto en valores de formulario (texto).
 *
 * @param {Object|null} product - Producto a editar o null para uno nuevo
 * @returns {{ name: string, description: string, price: string, stock: string, categoryId: string }} Valores iniciales
 */
function toFormValues(product) {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock ?? 0) : '0',
    categoryId: product?.categoryId ?? '',
  };
}

/**
 * Componente ProductForm.
 * Propósito: Crear o editar un producto, validando antes de llamar a la API.
 * Solo ofrece categorías activas, salvo la que ya tenga el producto.
 *
 * @param {Object} props
 * @param {Object|null} props.product - Producto a editar, o null para crear
 * @param {Array<{ id: string, name: string, active: boolean }>} props.categories - Categorías
 * @param {boolean} props.pending - Deshabilita el formulario mientras se guarda
 * @param {function({ name: string, description: string, price: number, stock: number, categoryId: string }): void} props.onSubmit - Guarda los datos ya validados
 * @param {function(): void} props.onCancel - Cierra el formulario
 * @returns {JSX.Element} Formulario de producto
 */
function ProductForm({ product, categories, pending, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormValues(product));
  const [errors, setErrors] = useState({});

  const options = categories.filter(category => category.active || category.id === product?.categoryId);

  /**
   * Actualiza un campo del formulario.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} event - Cambio
   * @returns {void}
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  };

  /**
   * Valida y entrega los datos con tipos numéricos.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Envío
   * @returns {void}
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateProduct(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
    });
  };

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit} noValidate>
      <h2 className="admin-card-title">{product ? 'Editar producto' : 'Nuevo producto'}</h2>

      <div className="admin-form-grid">
        <label className="admin-field">
          <span className="admin-field-label">Nombre</span>
          <input name="name" className="admin-input" value={form.name} onChange={handleChange} disabled={pending} />
          {errors.name && <span className="admin-field-error">{errors.name}</span>}
        </label>

        <label className="admin-field">
          <span className="admin-field-label">Categoría</span>
          <select name="categoryId" className="admin-input" value={form.categoryId} onChange={handleChange} disabled={pending}>
            <option value="">Selecciona una categoría</option>
            {options.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.categoryId && <span className="admin-field-error">{errors.categoryId}</span>}
        </label>

        <label className="admin-field">
          <span className="admin-field-label">Precio (USD)</span>
          <input name="price" type="number" min="0.01" step="0.01" className="admin-input" value={form.price} onChange={handleChange} disabled={pending} />
          {errors.price && <span className="admin-field-error">{errors.price}</span>}
        </label>

        <label className="admin-field">
          <span className="admin-field-label">Stock</span>
          <input name="stock" type="number" min="0" step="1" className="admin-input" value={form.stock} onChange={handleChange} disabled={pending} />
          {errors.stock && <span className="admin-field-error">{errors.stock}</span>}
        </label>

        <label className="admin-field admin-field-wide">
          <span className="admin-field-label">Descripción</span>
          <textarea name="description" rows={3} className="admin-input" value={form.description} onChange={handleChange} disabled={pending} />
          {errors.description && <span className="admin-field-error">{errors.description}</span>}
        </label>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-secondary-btn" onClick={onCancel} disabled={pending}>
          Cancelar
        </button>
        <button type="submit" className="admin-primary-btn" disabled={pending}>
          {pending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
