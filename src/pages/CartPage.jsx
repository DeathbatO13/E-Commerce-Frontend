export default function CartPage() {
  return (
    <main className="flex-1 w-full">
      <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 pb-6">
            <a
              className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
              href="#"
            >
              Home
            </a>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal">
              /
            </span>
            <a
              className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors"
              href="#"
            >
              Productos
            </a>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-normal">
              /
            </span>
            <span className="text-[#0d141b] dark:text-slate-200 text-sm font-medium leading-normal">
              Carrito
            </span>
          </div>
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-baseline gap-3 pb-8">
            <p className="text-[#0d141b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Tu Carrito de Compras
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Tienes 2 items en tu carrito
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
            {/* Product List */}
            <div className="lg:col-span-2 w-full space-y-4">
              <div className="bg-white dark:bg-background-dark rounded-xl shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 hidden md:grid grid-cols-6 gap-4 items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span className="col-span-3">Producto</span>
                  <span className="text-center">Cantidad</span>
                  <span className="text-right">Precio</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {/* ListItem 1 */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4">
                    <div className="col-span-2 md:col-span-3 flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0"
                        data-alt="Black graphic t-shirt"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsUVC4GmbqNfaOV9BLyZr9x2JjPPEnxVPMuiXCQPF_o8vwIz4RAUtmXdyGis9BiA--GDTuVmlDGqy9ofyi7VhHDqlAVJdqWGkDhENZRChZglSKM0S2rb_1dnZgTs6jCfJsTGsKOdidAuMBZuj4lKeyuUiEWCTojSlUWI2svOf8Wh4JOrB6-lM7gThf8m4wJJc-ZB93S1YTpaBeJkMA833PHN5onEN5Ik3RgTTba2QhfmOuUi2dkqQEZ2PtHVfRcg0KGnx6r8Tt8AG1")'
                        }}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-[#0d141b] dark:text-slate-100 text-base font-medium leading-normal line-clamp-1">
                          Camiseta Gráfica
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">
                          Color: Negro, Talla: L
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start md:justify-center">
                      <div className="flex items-center gap-2 text-[#0d141b] dark:text-slate-200">
                        <button className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                          -
                        </button>
                        <input
                          className="text-base font-medium leading-normal w-8 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          type="number"
                          defaultValue={1}
                        />
                        <button className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-medium text-slate-700 dark:text-slate-300">
                      $25.00
                    </div>
                    <div className="text-right font-bold text-[#0d141b] dark:text-white">
                      $25.00
                    </div>
                    <button className="col-span-2 md:col-span-6 md:absolute md:top-4 md:right-4 h-8 w-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </div>
                  {/* ListItem 2 */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center p-4">
                    <div className="col-span-2 md:col-span-3 flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0"
                        data-alt="White sports sneakers"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDARnj4uXbiadWYvlXduNKcs5eAR8Y6wlN02kQKY1hMtJzTlYf9LXgavRVh6JUpfVG5iO8uS7oRNRfwUe0-gtloJTvElaPG1ij-pGAa8bOToZ23TWIZ9B75udWoyE1S--eVXs5euk9dHq6qWkYkPiBWv2PAJ6yhBuHfn1LDXfa-jw3v0mNdFAqVDwLg-PmWZLRSFhZqBJc1eQgKO9dpN4vd31PTEk_vdcnJeOaeTYL_OC58JQ_JVf4Sb1kYqgehwEEwwlNmf2-cEzCr")'
                        }}
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-[#0d141b] dark:text-slate-100 text-base font-medium leading-normal line-clamp-1">
                          Zapatillas Deportivas
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">
                          Color: Blanco, Talla: 42
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start md:justify-center">
                      <div className="flex items-center gap-2 text-[#0d141b] dark:text-slate-200">
                        <button className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                          -
                        </button>
                        <input
                          className="text-base font-medium leading-normal w-8 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          type="number"
                          defaultValue={1}
                        />
                        <button className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-medium text-slate-700 dark:text-slate-300">
                      $89.99
                    </div>
                    <div className="text-right font-bold text-[#0d141b] dark:text-white">
                      $89.99
                    </div>
                    <button className="col-span-2 md:col-span-6 md:absolute md:top-4 md:right-4 h-8 w-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <a
                className="flex items-center gap-2 text-primary font-medium hover:underline"
                href="#"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Continuar Comprando
              </a>
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1 w-full lg:sticky lg:top-24">
              <div className="bg-white dark:bg-background-dark rounded-xl shadow-sm p-6 space-y-6">
                <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">
                  Resumen del Pedido
                </h3>
                <div className="space-y-3 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">$114.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span className="font-medium text-sm text-slate-500 dark:text-slate-400">
                      Calculado en el siguiente paso
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div className="flex justify-between items-center font-bold text-lg text-[#0d141b] dark:text-white">
                    <span>Total</span>
                    <span>$114.99</span>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow">
                  Proceder al Checkout
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}