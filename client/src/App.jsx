import Dashboard from './pages/DashBoard'
import ProductForm from './pages/ProductForm'
import ViewCategory from './pages/ViewCategory'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router'
import CheckAuth from './CheckAuth'
import AllProducts from './pages/AllProducts'
import ProductTable from './pages/ProductTable'
// import AddProduct from './try/AddProduct'
// import AddProduct2 from './try/addProduct2'
// import AddProductForm from './pages/AddProductFrom'

// import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<CheckAuth><Dashboard /></CheckAuth>} />
          <Route path="/category/:categoryId" element={<CheckAuth><ViewCategory /></CheckAuth>} />
          <Route path="/product/:productId" element={<CheckAuth><ProductForm /></CheckAuth>} />
          <Route path="/addProduct/:categoryId?/:subCategoryId?" element={<CheckAuth><ProductForm /></CheckAuth>} />
          <Route path="/allProducts" element={<CheckAuth><AllProducts /></CheckAuth>} />
          {/* <Route path="/table" element={<CheckAuth><ProductTable /></CheckAuth>} /> */}
          {/* <Route path="/try-addproduct" element={<CheckAuth><AddProduct2 /></CheckAuth>} />
          <Route path="/addproductform" element={<CheckAuth><AddProductForm /></CheckAuth>} /> */}

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
