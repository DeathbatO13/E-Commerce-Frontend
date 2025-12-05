export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-black leading-tight tracking-tighter">Bienvenido a E-Commerce</h1>
        <p className="text-base text-subtext-light dark:text-subtext-dark">Explora nuestros productos disponibles en tienda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <aside className="order-1 lg:order-none lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <h3 className="text-lg font-bold">Filtros</h3>
            <div>
              <h4 className="font-semibold">Categoría</h4>
              <div className="space-y-2 mt-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary" />
                  <span className="ml-3 text-sm">Electrónica</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary" />
                  <span className="ml-3 text-sm">Muebles</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary" />
                  <span className="ml-3 text-sm">Ropa</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Rango de Precio</h4>
              <input type="range" min={0} max={1000} defaultValue={500} className="w-full mt-2" />
              <div className="flex justify-between text-sm text-subtext-light dark:text-subtext-dark mt-1">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold">Disponibilidad</h4>
              <label className="inline-flex items-center mt-2">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary" />
                <span className="ms-3 text-sm font-medium">En stock</span>
              </label>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <button className="flex w-full items-center justify-center rounded-lg h-10 bg-primary text-white text-sm font-bold">Aplicar Filtros</button>
              <button className="flex w-full items-center justify-center rounded-lg h-10 border border-border-light text-sm">Limpiar</button>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm transition-all hover:shadow-lg">
          <div className="w-full bg-center bg-no-repeat aspect-square bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqPGr6ETRAKcoY8rIOOxdL7ud9F4CM32pUBReP1Sgt0GS5ellS91pMoA-QcdQ5YJOdYbsVzucxt-olpweJx4-LNlzIwMGSBQSV-C36Gcv2GxUSO7jRoime19xnnvxby1Iet0xmLMFmh3qffLDBAaSuhdcUPI0VZISpCF_51GMbBcHtiL1bzmvWB2qVUFtK02R1izK6V_nCKRM4wU7vzuvWGxZPJhneF7i7VrgrvjQCPBQVZQOHHo0hp8gQy7GahXSvDa1oi6W4bXhI")' }} />
          <div className="flex flex-col gap-1 p-4">
            <p className="text-sm text-subtext-light dark:text-subtext-dark">Furniture</p>
            <p className="text-base font-bold text-text-light dark:text-text-dark">Modern Armchair</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-lg font-black text-primary">$299.99</p>
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">In Stock</span>
            </div>
          </div>
        </div>

        <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm transition-all hover:shadow-lg">
          <div className="w-full bg-center bg-no-repeat aspect-square bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBz6Gq81zyQtVuYdXaElWDz-72zKMGwMvq5t_urhRMYfSvZM6uNAJZp-0qx_sMf5x11gOY_3NfhcliQPghaEz7Fhw0tPEpceZDsAbn0GFu-RxA676TWrB01NdyJ64wFLym3asBqeVL69CYbLvxjP2WQXiDQ2P7UOMhKxhp05LZK3-N_Qn7Q8wZHQ3UfEcfGwCJdpGwwq67kfV7yOLl9xLl2IE5qfN8xMJ_xP9kMt0ptWCElReyB4m1pU9UuC8u_2FbJtyxRVd5CTg21")' }} />
          <div className="flex flex-col gap-1 p-4">
            <p className="text-sm text-subtext-light dark:text-subtext-dark">Electronics</p>
            <p className="text-base font-bold text-text-light dark:text-text-dark">Wireless Headphones</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-lg font-black text-primary">$149.00</p>
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">In Stock</span>
            </div>
          </div>
        </div>

        <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm transition-all hover:shadow-lg">
          <div className="w-full bg-center bg-no-repeat aspect-square bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAfJ5baPxu0NVANm6J3WcBAE6EyHT4kTLpYugetpZ7q8UPmTxUbqJzRq7sJXJVcVweL-x66sTffSzXbAg4xt6chu5Z_t65kR_tc0X0Ozbhufx_v6t06Ga9Jtk_GfxgR0o6nvgr66RfK_nCCaONSKcD5Dd3Cd0mnjMkgpjhb7xR9dJqrrOPShNjPXezl9LELqFveInwX6I_UFHUykOY7EXkgLLm7armO6xd9sd9ijYdKL2HoBptiWgSOJslGJG2P6dq2pUKiZJYNEmS")' }} />
          <div className="flex flex-col gap-1 p-4">
            <p className="text-sm text-subtext-light dark:text-subtext-dark">Accessories</p>
            <p className="text-base font-bold text-text-light dark:text-text-dark">Leather Backpack</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-lg font-black text-primary">$89.50</p>
              <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900 px-2 py-0.5 text-xs font-medium text-red-800 dark:text-red-200">Out of Stock</span>
            </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
