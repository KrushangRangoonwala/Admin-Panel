import 'dotenv/config';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import Product from '../models/productSchema.js';
import subCategory from '../models/subCategorySchema.js';
import category from '../models/categorySchema.js';
import Size from '../models/sizeSchema.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use `app-specific` password of email acc
  },
});

const generateEmailContent = (productList, orgMongooseProdObj) => {
  const attachments = [];
  orgMongooseProdObj.forEach((product, index) => {  // this requires orgMongooseProdObj, which is mongooseObject
    // if we use productList instead of orgMongooseProdObj, we can't get mainImage and subImages in email
    if (product.mainImage?.data) {
      attachments.push({
        filename: product.mainImage.originalName,
        content: Buffer.from(product.mainImage.data),
        cid: `main-${product._id}`,
      });
    }
    product.subImages?.forEach((subImage, subIndex) => {
      if (subImage?.data) {
        attachments.push({
          filename: subImage.originalName,
          content: Buffer.from(subImage.data),
          cid: `sub-${product._id}-${subIndex}`,
        });
      }
    });
  });

  // Generate HTML for products
  const productHtml = productList
    .map((product) => `
      <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 8px; background-color: #fff; max-width: 100%; box-sizing: border-box;">
        <h2 style="color: #333; font-size: 20px; margin: 0 0 10px; text-align: center;">${product.productName}</h2>
        <p style="margin: 0 0 10px; color: #555; font-size: 14px;">${product.desc}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 10px; box-sizing: border-box;">
              <img src="cid:main-${product._id}" alt="${product.productName}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
              <div style="margin-top: 10px; text-align: center; font-size: 0;">
                ${product.subImages
        .map(
          (subImage, subIndex) =>
            `<img src="cid:sub-${product._id}-${subIndex}" alt="${product.productName} sub-image ${subIndex + 1}" style="max-width: 30%; height: auto; margin: 5px; border-radius: 4px; display: inline-block;" />`
        )
        .join('')}
              </div>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 10px; box-sizing: border-box;">
              <p style="margin: 0 0 10px; color: #333; font-size: 14px;"><strong>Category:</strong> ${product.categoryId}</p>
              <p style="margin: 0 0 10px; color: #333; font-size: 14px;"><strong>Subcategory:</strong> ${product.subCategoryId.map(val => val).join(', ')}</p>
              <p style="margin: 0 0 10px; color: #333; font-size: 14px;"><strong>MRP Price:</strong> ₹${product.mrpPrice}</p>
              <p style="margin: 0 0 10px; color: #333; font-size: 14px;"><strong>Sale Price:</strong> ₹${product.salePrice}</p>
              <div style="margin: 0 0 10px;">
                <strong style="color: #333; font-size: 14px;">Stock Sizes:</strong>
                <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                  <thead>
                    <tr>
                      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f5f5f5; font-size: 14px;">Size</th>
                      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f5f5f5; font-size: 14px;">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${product.stockSize
        .map(
          (s) => `
                          <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${s.size}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; font-size: 14px;">${s.stock}</td>
                          </tr>
                        `
        )
        .join('')}
                  </tbody>
                </table>
              </div>
              <p style="margin: 0 0 10px; color: #333; font-size: 14px;"><strong>Status:</strong> ${product.status}</p>
              <p style="margin: 0 0 10px; color: #333; font-size: 14px;"><strong>Weight:</strong> ${product.weight} kg</p>
            </td>
          </tr>
        </table>
      </div>
    `)
    .join('');

  return {
    html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @media only screen and (max-width: 600px) {
              .product-container { padding: 10px !important; }
              .product-container h2 { font-size: 16px !important; }
              .product-container p, .product-container th, .product-container td { font-size: 12px !important; }
              .product-container img { max-width: 100% !important; }
              .sub-images img { max-width: 45% !important; margin: 3px !important; }
              .stock-table { font-size: 12px !important; }
            }
          </style>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box;" class="product-container">
            <h1 style="color: #3870eb; text-align: center; font-size: 24px;">Today's New Product</h1>
            <p style="color: #555; text-align: center; margin-bottom: 20px; font-size: 14px;"><b>Total Added New Products : ${productList.length}</b></p>
            ${productHtml}
            <p style="color: #999; text-align: center; font-size: 12px;">© 2025 All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    attachments,
  };
};

const sendEmail = async (to, subject, productList, orgMongooseProdObj) => {
  const { html, attachments } = generateEmailContent(productList, orgMongooseProdObj);
  const mailOptions = {
    from: `"ABABABABABAB" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('SDSDSDSD Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function getCategoryById(id) {
  try {
    const record = await category.findById(id);
    return record.name;
  } catch (error) {
    console.log("\n\nError in getCategoryById:", error);
  }
}

async function getSubCategoryById(id) {
  try {
    const record = await subCategory.findById(id);
    return record.name;
  } catch (error) {
    console.log("\n\nError in getSubCategoryById:", error);
  }
}

function findAllSubCategoryById(subcategoryIds) {
  return Promise.all(
    subcategoryIds.map(async (id) => {
      const record = await getSubCategoryById(id);
      return record;
    })
  );
}

async function getSizeName(id) {
  try {
    const record = await Size.findById(id);
    return record.name;
  } catch (error) {
    console.log("\n\nError in getSizeName:", error);
  }
}

function findAllSizeById(stockSizeIds) {
  return Promise.all(
    stockSizeIds.map(async (val) => {
      const sizeName = await getSizeName(val.size);
      const record = { size: sizeName, stock: val.stock };
      return record;
    })
  );
}

const scheduleEmail = async () => {
  // schedule.scheduleJob({ hour: 21, minute: 51 }, async () => {
  console.log("inside scheduler.......");
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today (00:00:00.000)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today (23:59:59.999)

    const products = await Product.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).lean();   // Use .lean() to get plain JavaScript objects, we can change this object
    // without lean() we get mongooseObject, which is immutable, we can't change monogooseObject

    const orgMongooseProdObj = await Product.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });  // here we don't use lean(), so we get mongooseObject
    // we need this object to get buffers of mainImage and subImages of products, 
    // without this mongooseObject we can't generate images in generateEmailContent() function

    const updatedProductList = await Promise.all(
      products.map(async (product) => {
        const updatedProduct = product;
        const catName = await getCategoryById(product.categoryId);

        const subCatNames = await findAllSubCategoryById(product.subCategoryId)
          .then((subCatNms) => subCatNms)
          .catch((error) => {
            console.error('Error fetching subcategory names:', error);
            return [];
          });

        const stockSize = await findAllSizeById(product.stockSize)
          .then((sizes) => sizes)
          .catch((error) => {
            console.error('Error fetching stock sizes:', error);
            return [];
          });

        updatedProduct.categoryId = catName;
        updatedProduct.subCategoryId = subCatNames;
        updatedProduct.stockSize = stockSize;

        return updatedProduct;
      })
    );

    if (products.length === 0) {
      console.log('No products to send.');
      return;
    }

    // Example recipient list (can be fetched from MongoDB)
    const recipients = ['krushangrangoonwala@gmail.com'];

    // Send email to all recipients
    await Promise.all(
      recipients.map((recipient) =>
        sendEmail(recipient, 'New Sari Highlights', updatedProductList, orgMongooseProdObj)
      )
    );
    console.log('Scheduled email sent to all recipients.');
  } catch (error) {
    console.error('Error in scheduled email job:', error);
  }
  // });
};

export { scheduleEmail };