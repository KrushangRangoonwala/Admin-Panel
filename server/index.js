import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './connectDB.js';
import userRouter from './routes/userRoutes.js';
import morgan from 'morgan';
import { checkAuth } from './middleware/checkAuth.js';
import cookieParser from 'cookie-parser';
import categoryRouter from './routes/categoryRoutes.js';
import subCategoryRouter from './routes/subCategoryRoutes.js';
import productRouter from './routes/productRoutes.js';
import otherDetailsRoute from './routes/otherDetailsRoute.js';
import cors from 'cors';
import sizeRouter from './routes/sizeRoutes.js';

const app = express();
app.use(morgan('dev'))

app.use(express.json()); // for parsing application/json format request data
// app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],// your frontend origin
  credentials: true
}));

dotenv.config();
const PORT = process.env.PORT || 8000;

connectToDB('mongodb://localhost:27017/app');

app.use('/login', userRouter);
app.use('/', checkAuth, otherDetailsRoute)
app.use('/category', checkAuth, categoryRouter);
app.use('/subCategory', checkAuth, subCategoryRouter);
app.use('/product', checkAuth, productRouter);
app.use('/size', checkAuth, sizeRouter);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));