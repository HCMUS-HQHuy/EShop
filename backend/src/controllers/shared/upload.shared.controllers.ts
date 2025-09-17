import express from 'express';
import util from 'src/utils/index.utils';
import * as types from 'src/types/index.types';

function updateImage(req: types.RequestCustom, res: express.Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/temp/${req.file.filename}`;
  res.status(200).json(util.response.success('File uploaded successfully', [
    {
      filename: req.file.filename,
      url: fileUrl
    }
  ]));
};

function updateListImage(req: types.RequestCustom, res: express.Response) {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const filesUrl: {filename: string, url: string}[] = [];
  for (const file of req.files as Express.Multer.File[]) {
    const fileUrl = `/uploads/temp/${file.filename}`;
    console.log('Uploaded file URL:', fileUrl);
    filesUrl.push({
      filename: file.filename,
      url: fileUrl
    });
  }
  res.status(200).json(util.response.success('Files uploaded successfully', filesUrl));
};

const upload = {
    image: updateImage,
    listImage: updateListImage
}

export default upload;
