const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const sendEmail = require("../utils/sendEmail");

// Create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  if (!order) {
    return next(new ErrorHandler(`Unable to create order`, 400));
  }
  res.status(201).json({
    success: true,
    order,
  });
});

// get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler(`No order found with id`, 400));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({ success: true, orders });
});

// get all orders  -- admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0; // for analytics
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({ success: true, totalAmount, orders });
});

// update order status -- admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("No order found with this id", 400));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("This order has been delivered", 400));
  }

  if (order.orderStatus === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.qty);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "delivered") {
    // let options = {
    //   email: user.email,
    //   subject: "Your Order",
    //   message: "Your Order has been Delivered",
    // };
    // try {
    //   await sendEmail(options);
    // } catch (e) {
    //   return next(new ErrorHandler(e.message, 500));
    // }
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// delete order -- admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("No order found with this id", 404));
  }

  await Order.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true });
});

async function updateStock(id, qty) {
  const product = await Product.findById(id);
  product.stock -= qty;
  await product.save({
    validateBeforeSave: false,
  });
}
