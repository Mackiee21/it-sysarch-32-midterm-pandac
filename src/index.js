const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const connectToDB = require("./connection_db");

//import routers
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const userRouter = require("./routes/user");

const User = require("./schemas/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client", "dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", userRouter);

app.use("/api", (req, res, next) => {
  try {
    console.log("WHOS MAKING THE REQEST", req.url);
    const decoded = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );
    console.log("VERIFIED", decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Token has expired" });
  }
});

app.post("/api/validate-user", async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await User.findById(_id);
    if (!user)
      return res.status(401).json({ message: "Special Unauthorized Access" });
    res.status(200).json({ success: true, user }); //this middleware is not really useful if you imagine, it only gets called during first launch
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

connectToDB().then(() => {
  app.listen(3000, () => {
    console.log("Server is running...");
  });
});
