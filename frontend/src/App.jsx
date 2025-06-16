import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'
import UserRoute from './routes/UserRoute'
import 'react-toastify/dist/ReactToastify.css'
import { Toaster} from 'sonner';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster richColors position='top-right'/>
        <Router>
          <Routes>
            <Route path="/*" element={<UserRoute />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
