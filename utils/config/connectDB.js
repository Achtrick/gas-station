import Category from "@/models/category.model";
import Product from "@/models/product.model";
import Sale from "@/models/sale.model";
import SubCategory from "@/models/subCategory.model";
import mongoose from "mongoose";

const category = Category;
const subCategory = SubCategory;
const product = Product;
const sale = Sale;

mongoose.set("strictQuery", true);
const connectMongo = async () => mongoose.connect(process.env.DB_URI);

export default connectMongo;
