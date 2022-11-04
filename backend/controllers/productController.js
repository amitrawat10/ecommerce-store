const Product = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
// create products -- admin
exports.createProdcut = catchAsyncError(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// get all products -- admin
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  let resultPerPage = 5;
  const productsCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query.clone();
  res.status(200).json({
    success: true,
    products,
    filteredProductsCount,
    productsCount,
    resultPerPage,
    selectedCategory: req.query.category,
  });
});
// get products category -- admin
exports.getProductsCategory = catchAsyncError(async (req, res, next) => {
  const productsCategory = await Product.find({}, { category: 1 });
  res.status(200).json({ success: true, productsCategory });
});
// get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const similars = await getSimilarProduct(product.category);

  const similarProducts = similars.filter((item) => item._id != req.params.id);
  res.status(200).json({ success: true, product, similarProducts });
});

async function getSimilarProduct(category) {
  return await Product.find({ category });
}

// update product -- admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(ErrorHandler("Product not found", 404));
  }
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // deletee images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  }

  const imagesLinks = [];
  if (images !== undefined) {
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, product });
});

//  delete product -- admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const deleted = await Product.findById(req.params.id);
  if (!deleted) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // delete imgs from cloudinary
  for (let i = 0; i < deleted.images.length; i++) {
    await cloudinary.v2.uploader.destroy(deleted.images[i].public_id);
  }

  await Product.deleteOne(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

// get admin products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// create/update product review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const userReview = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler(`No product found with this id`, 404));
  }

  const isReviewed = await product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  // if product is already reviewd by user, now update the review
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (req.user._id.toString() === review.user.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    // first time review
    product.reviews.push(userReview);
    product.numOfReviews = product.reviews.length;
  }

  // get the average product rating
  let avg = 0;

  product.reviews.forEach((review) => {
    avg += review.rating; // get the sum of all ratings
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler(`no product found`, 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete product review  -- Admin
exports.deleteProductReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }

  // get all the reviews except the one to be deleted
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((review) => {
    avg += review.rating;
  });

  let ratings = 0;
  // product has single review and has to be deleted
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
