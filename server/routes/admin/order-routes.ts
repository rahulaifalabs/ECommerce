// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
import express from "express"

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getTotalRevenue,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get/totalRevenue", getTotalRevenue)
router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
