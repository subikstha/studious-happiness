import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res
    .json({
      message: "world",
    })
    .status(200);
});

app.post("/cake/:name/:id", (req, res) => {
  res.send({
    cakeName: req.params.name,
    cakeId: req.params.id,
  });
});

app.post("/cake", (req, res) => {
  res.send("next");
});

export { app };

export default app;
