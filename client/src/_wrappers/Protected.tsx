import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ArrowLeft, Plus } from "lucide-react";
import { useAppContext } from "../provider";

const Protected = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, tokenExpired, logout, setTokenExpired } = useAppContext();

  // useEffect(() => {}, [state.image])
  console.log("DO I GET RE-RENDERED?", state);

  return (
    <section className="flex flex-col h-dvh relative">
      {tokenExpired && (
        <div className="h-full grid place-items-center absolute inset-0 z-[20] bg-white/30">
          <div className="bg-white rounded-md p-5 border-2 border-slate-200">
            <p>
              <span className="font-medium block mb-2 text-black/70">
                Token Expired
              </span>
              You have been logged out. Log in again
            </p>
            <button
              onClick={
                () => {
                  logout();
                  navigate("/");
                  setTokenExpired(false);
                } //NEED TO DO THIS PARA MA RESTART ANG STATE VALUE TO PREVENT SHHOWING THE EXPIRED TOKEN MODAL ONCE USER RE-LOGS IN
              }
              className="ms-auto block mt-5 bg-gray-500 text-white/85 py-1.5 px-6 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Header />
      <div
        style={{ height: `calc(100dvh - 4.375rem)` }}
        className="flex-1 grid grid-cols-[minmax(15rem,_auto)_1fr]"
      >
        <aside className="h-full overflow-y-auto p-3">
          <Link
            to="/profile"
            className="mb-2 flex items-center gap-2 pb-2 border-b-[1.5px] border-slate-300"
          >
            <img
              src={state.image as string}
              alt="profile"
              className="w-10 aspect-square rounded-full"
            />
            <div className="leading-5">
              <p className="font-medium">{state.name}</p>
              <span className="text-gray-700 text-sm">{state.email}</span>
            </div>
          </Link>
          <nav className="flex flex-col gap-3">
            {location.pathname !== "/" && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 p-2.5 text-sm bg-gray-500 rounded text-white"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
            )}
            <Link
              to="/add-product"
              className="flex items-center gap-1.5 p-2.5 text-sm rounded  hover:bg-slate-200 transition-all"
            >
              <div className="p-1 rounded-full bg-red-700">
                <Plus size={18} color="white" className="" />
              </div>
              <span className="font-normal">Add Product</span>
            </Link>
          </nav>
        </aside>
        <main className="w-full h-full overflow-y-auto lg:p-10 md:p-5 p-2">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default Protected;
