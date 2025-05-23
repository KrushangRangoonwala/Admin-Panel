import { useState } from 'react'
import Dashboard from './pages/DashBoard'
import CategoryForm from './components/CategoryForm'
import SubCategoryForm from './components/SubCategoryForm'
import ProductForm from './pages/ProductForm'
import ViewCategory from './pages/ViewCategory'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router'
import CheckAuth from './CheckAuth'
import Navbar from './components/Navbar'
import AllProducts from './pages/AllProducts'
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
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
