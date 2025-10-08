// // AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
// const Order = require("../../models/Order");

// // ✅ Get total revenue from confirmed orders only
// const getTotalRevenue = async (req, res) => {
//   try {
//     // Find only confirmed orders
//     const confirmedOrders = await Order.find({ orderStatus: "delivered" });

//     if (!confirmedOrders.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No confirmed orders found!",
//         totalRevenue: 0,
//       });
//     }

//     // Calculate total revenue
//     const totalRevenue = confirmedOrders.reduce(
//       (sum, order) => sum + (order.totalAmount || 0),
//       0
//     );

//     res.status(200).json({
//       success: true,
//       message: "Total revenue calculated successfully!",
//       totalRevenue,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred while calculating revenue!",
//     });
//   }
// };

// const getAllOrdersOfAllUsers = async (req, res) => {
//   try {
//     const orders = await Order.find({});

//     if (!orders.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No orders found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getOrderDetailsForAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { orderStatus } = req.body;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found!",
//       });
//     }

//     await Order.findByIdAndUpdate(id, { orderStatus });

//     res.status(200).json({
//       success: true,
//       message: "Order status is updated successfully!",
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// module.exports = {
//   getAllOrdersOfAllUsers,
//   getOrderDetailsForAdmin,
//   updateOrderStatus,
//   getTotalRevenue
// };

// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
import { Request, Response } from "express";
import { io } from "../../server";
// const io = require("../../server");
const Order = require("../../models/Order");

// ✅ Get total revenue from confirmed (delivered) orders
const getTotalRevenue = async (req: Request, res: Response) => {
  try {
    const confirmedOrders = await Order.find({ orderStatus: "delivered" });

    if (!confirmedOrders.length) {
      return res.status(404).json({
        success: false,
        message: "No confirmed orders found!",
        totalRevenue: 0,
      });
    }

    const totalRevenue = confirmedOrders.reduce(
      (sum: number, order: any) => sum + (order.totalAmount || 0),
      0
    );

    res.status(200).json({
      success: true,
      message: "Total revenue calculated successfully!",
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while calculating revenue!",
    });
  }
};

// ✅ Get all orders (for admin)
const getAllOrdersOfAllUsers = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// ✅ Get specific order details (for admin)
const getOrderDetailsForAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// ✅ Update order status (with Socket.IO real-time update)
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // ✅ Update order status
    await Order.findByIdAndUpdate(id, { orderStatus });

    // ✅ Recalculate totals only after successful update
    const confirmedOrders = await Order.find({ orderStatus: "delivered" });
    const totalRevenue = confirmedOrders.reduce(
      (sum: number, o: any) => sum + (o.totalAmount || 0),
      0
    );

    const totalOrders = await Order.countDocuments();

    // ✅ Emit to all connected admin dashboards
    io.emit("orderUpdate", {
      success: true,
      message: "Order status updated successfully!",
      totalRevenue,
      totalOrders,
    });

    console.log("📢 Emitted 'orderUpdate' event to dashboards");
    console.log("totalRevenue", totalRevenue);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
    });
  } catch (e) {
    console.error("❌ Error updating order status:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getTotalRevenue,
};
