import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productsRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import ordersRoutes from "./order.routes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", ordersRoutes);

export default router;