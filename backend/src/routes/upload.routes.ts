import express from "express";
import mid from "src/middlewares/index.middlewares";
import upload from "src/controllers/shared/upload.shared.controllers";

const route = express.Router();

route.post("/uploads/image", mid.upload.single('image'), upload.image);
route.post("/uploads/listImage", mid.upload.array('imageList'), upload.listImage);

export default route;
