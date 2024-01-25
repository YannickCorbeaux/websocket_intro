import express from "express";

const app = express();

app.use(express.static("./assets/"));

export default app;
