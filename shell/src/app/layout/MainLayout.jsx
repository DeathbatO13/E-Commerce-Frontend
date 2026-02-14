import React from 'react'

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">
            E-Commerce
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500">
          © MVP E-Commerce
        </div>
      </footer>

    </div>
  );
}

export default MainLayout;
