import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import ProtectedRoute from '../protectedroutes/ProtectedRoute'
import SignUpPage from '../pages/SignUpPage'



function UserRoute() {
  return (
    <Routes>
        <Route path='login/' element={<LoginPage/>}></Route>
        <Route path='' element={<ProtectedRoute><HomePage/></ProtectedRoute>}></Route>
        <Route path='signup/' element={<SignUpPage/>}></Route>
    </Routes>
  )
}

export default UserRoute
