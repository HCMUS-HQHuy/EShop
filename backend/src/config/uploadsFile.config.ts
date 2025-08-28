import express from 'express';
import path from 'path';

function configStaticFiles(app: express.Application) {
    console.log('public path:', path.join(__dirname, '../../uploads'));
    console.log('public path:', path.join(__dirname, '../../public'));
    app.use('/public', express.static(path.join(__dirname, '..', '..', 'uploads')));
    app.use('/static', express.static(path.join(__dirname, '..', '..', 'public')));
};

export default configStaticFiles;