import { Link, Outlet, useLocation } from "react-router-dom"
import Header from "../components/Header"
import { ArrowLeft, Plus } from 'lucide-react'
import { useAppContext } from "../provider"

const Protected = () => {
  const location = useLocation()
  const { state } = useAppContext()
  
  return (
    <section className="flex flex-col h-dvh">
        <Header />
        <div style={{height: `calc(100dvh - 4.375rem)`}} className="flex-1 grid grid-cols-[minmax(15rem,_auto)_1fr]">
            <aside className="h-full overflow-y-auto p-3">
              <div className="mb-3 flex items-center gap-2 pb-2 border-b-[1.5px] border-slate-300">
                <img src={state.image as string} alt="profile" className="w-10" />
                <div className="leading-5">
                    <p className="font-medium">{state.name}</p>
                    <span className="text-gray-700 text-sm">{state.email}</span>
                </div>
              </div>
              <nav className="flex flex-col gap-3">
                {location.pathname !== "/" && 
                  <Link to="/" className="flex items-center gap-1.5 p-2.5 text-sm bg-gray-500 rounded-lg text-white">
                      <ArrowLeft size={20} />
                      <span>Back</span>
                  </Link>}
                <Link to="/add-product" className="flex items-center gap-1.5 p-2.5 text-sm bg-red-700 rounded-lg text-white">
                    <Plus size={20} />
                    <span>Add Product</span>
                </Link>
              </nav>
            </aside>
            <main className="w-full h-full overflow-y-auto lg:p-10 md:p-5 p-2">
              <Outlet />
            </main>
        </div>
      
    </section>
  )
}

export default Protected
