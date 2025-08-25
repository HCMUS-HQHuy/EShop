import express from 'express';
import path from 'path';
import * as types from 'types/index.types';

function updateImage(req: types.RequestCustom, res: express.Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/temp/${req.file.filename}`;
  res.status(200).json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    url: fileUrl
  });
};

const update = {
    image: updateImage
}

export default update;
