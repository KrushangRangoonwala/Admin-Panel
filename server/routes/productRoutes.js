import express from "express";
import {
  addProduct,
  deleteProduct,
  downloadCsv,
  getProductByPage,
  getBySearchText,
  getProductByCategory,
  getProductById,
  getProductBySubCategory,
  updateProduct,
  uploadCsv,
  getSortedProduct,
} from "../controllers/productController.js";
import { uploadProductImages } from "../middleware/uploadFiles.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // or your preferred folder

router.route("/").get(getProductByPage).post(uploadProductImages, addProduct);

router
  .route("/id/:id")
  .get(getProductById)
  .put(uploadProductImages, updateProduct)
  .delete(deleteProduct);

router.get("/productByCategory/:categoryId", getProductByCategory);
router.get("/productBySubCategory/:subCategoryId", getProductBySubCategory);

router.get("/searchBy/:searchText", getBySearchText);

router.post("/downloadCsv", downloadCsv);

router.post("/uploadCsv", upload.single("csv"), uploadCsv);

router.get("/sort", getSortedProduct);

export default router;
