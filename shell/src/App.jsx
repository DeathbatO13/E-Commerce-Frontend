import MainLayout from './app/layout/MainLayout'
import TopNavBar from './shared/components/TopNavBar'
import Footer from './shared/components/Footer'

function App() {
  return (
    <div className="layout-wrapper">
      <TopNavBar />
      <main className="main-content">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Bienvenido a ReactStore</h1>
          <p className="mt-2 text-sm text-slate-600">El shell ya está cargando correctamente y el navbar está visible.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
