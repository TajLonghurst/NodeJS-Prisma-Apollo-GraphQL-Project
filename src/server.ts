import express from "express";

const app = express();

app.use("/", (req, res, next) => {
  res.status(200).json({
    Msg: "I work",
  });
});

app.listen(5000, () => {
  console.log("Started");
});
