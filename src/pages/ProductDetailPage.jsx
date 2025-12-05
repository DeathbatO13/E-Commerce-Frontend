export default function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary"
              href="#"
            >
              Inicio
            </a>
            <span className="text-sm text-gray-400 dark:text-gray-500">/</span>
            <a
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary"
              href="#"
            >
              Electrónica
            </a>
            <span className="text-sm text-gray-400 dark:text-gray-500">/</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Auriculares Inalámbricos Pro
            </span>
          </div>
          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column: Product Image */}
            <div className="w-full">
              <div className="aspect-square w-full rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center bg-no-repeat"
                  data-alt="High-quality wireless headphones on a yellow background"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDg73-ANCMVYPrKCj9__ViE5padbeUc3irn7k6h5twdG69HvUOxyEYuE-IDN9x0bH3vwOk6cjyUxO_1DSsY9O6Fvfkg1bTWXf7MRPGy9zrdoIZtklCUq0Sko6NR9VUHOs-TvwLbgb2m5Cr0NQqckdZihwl2y2RmOkpSOmMxJEQKQrZsJVWBCDaIyNBnMlpRkXHhZsb3CLBLcIcAL1vPSXcqXHTjo_gAc8nm7qh5asxpotS7AuhLnZWHFD9eyoUf5wIwCBZH4AWObR5o")'
                  }}
                />
              </div>
            </div>
            {/* Right Column: Product Info & Actions */}
            <div className="flex flex-col gap-6">
              {/* Category Chip */}
              <div className="flex">
                <div className="flex h-7 items-center justify-center gap-x-2 rounded-md bg-primary/20 px-3 py-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    Electrónica
                  </p>
                </div>
              </div>
              {/* Product Heading */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
                  Auriculares Inalámbricos Pro
                </h1>
                <p className="text-2xl font-bold text-primary">$149.99</p>
              </div>
              {/* Availability */}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500 text-xl">
                  check_circle
                </span>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  En Stock
                </p>
              </div>
              {/* Product Description */}
              <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400">
                <p>
                  Experimenta una calidad de sonido superior y una comodidad
                  inigualable con los Auriculares Inalámbricos Pro. Diseñados para
                  audiófilos y profesionales, ofrecen cancelación de ruido activa,
                  una batería de larga duración de 24 horas y conectividad
                  Bluetooth 5.2 sin interrupciones. El diseño ergonómico asegura
                  un ajuste perfecto para usar durante todo el día.
                </p>
              </div>
              <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-2" />
              {/* Actions: Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                  <button className="flex h-12 w-12 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg">
                    <span className="material-symbols-outlined text-xl">
                      remove
                    </span>
                  </button>
                  <input
                    className="h-12 w-14 border-x border-gray-200 dark:border-gray-700 bg-transparent text-center font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0"
                    type="text"
                    defaultValue={1}
                  />
                  <button className="flex h-12 w-12 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg">
                    <span className="material-symbols-outlined text-xl">add</span>
                  </button>
                </div>
                {/* Add to Cart Button */}
                <button className="flex w-full sm:w-auto flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <span className="material-symbols-outlined">
                    add_shopping_cart
                  </span>
                  <span>Agregar al Carrito</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}