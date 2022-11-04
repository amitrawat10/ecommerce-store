const catchAsyncError = require("../middlewares/catchAsyncError");
const Stripe = require("stripe");

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "MyEcom",
    },
  });
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});
exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
