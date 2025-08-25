import express from 'express';
import path from 'path';

function configUploadsFile(app: express.Application) {
    app.use('/public', express.static(path.join(__dirname, '../../uploads')));
};

export default configUploadsFile;