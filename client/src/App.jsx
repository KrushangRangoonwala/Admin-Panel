import { useState } from 'react'
import Dashboard from './pages/DashBoard'
import CategoryForm from './components/CategoryForm'
import SubCategoryForm from './components/SubCategoryForm'
import ProductForm from './pages/ProductForm'
import ViewCategory from './pages/ViewCategory'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router'
import CheckAuth from './CheckAuth'
// import './App.css'

function App() {

  const dummyCategory = {
    name: 'Electronics',
    slug: 'electronics',
    description: 'All electronic gadgets and accessories.',
    subCategories: [
      {
        name: 'Mobiles',
        description: 'Smartphones of all brands.',
        products: [
          { name: 'iPhone 14', price: 999, image: 'https://via.placeholder.com/120' },
          { name: 'Samsung S22', price: 899, image: 'https://via.placeholder.com/120' },
        ],
      },
      {
        name: 'Laptops',
        description: 'All kinds of laptops.',
        products: [
          { name: 'MacBook Pro', price: 1999, image: 'https://via.placeholder.com/120' },
        ],
      },
    ],
  };

  return (
    <>
      {/* <Dashboard /> */}
      {/* <CategoryForm isOpen={true}/> */}
      {/* <SubCategoryForm isOpen={true}/> */}
      {/* <ProductForm /> */}
      {/* <ViewCategory categoryData={dummyCategory} /> */}
      {/* <Login /> */}

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/" element={<CheckAuth><Dashboard /></CheckAuth>} />
          <Route path="/addProduct" element={<CheckAuth><ProductForm /></CheckAuth>} />
          <Route path="/category/:categoryId" element={<CheckAuth><ViewCategory /></CheckAuth>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
