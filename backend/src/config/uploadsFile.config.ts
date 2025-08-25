import express from 'express';
import path from 'path';

function configUploadsFile(app: express.Application) {
    console.log('public path:', path.join(__dirname, '../../uploads'));
    app.use('/public', express.static(path.join(__dirname, '..', '..', 'uploads')));
};

export default configUploadsFile;