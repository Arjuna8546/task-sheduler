import { useState } from 'react'
import { logout } from '../endpoints/user_api';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../store/slices/UserSlice';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
    const user = useSelector(state=>state.user)   
    const dispatch = useDispatch()  
    const nav = useNavigate()
  const onLogout = async()=>{
          await logout();
          dispatch(deleteUser());
          nav("/login");
          toast.success("logged out successfully")
  }

  return (
    <header className=" bg-black px-4 py-3 flex items-center justify-between md:px-8 relative">
      <h1 className="text-5xl font-bold text-stone-300">TASK</h1>

      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className="md:hidden focus:outline-none"
      >
        <div className="space-y-1">
          <div className="w-6 h-0.5 bg-gray-700"></div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
        </div>
      </button>

      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white border rounded-lg shadow-md p-4 w-48 md:hidden z-50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">{user?.user?.username || 'User'}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
