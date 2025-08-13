import express from 'express'
import qs from "qs";

function configQueryParser(app: express.Application) {
    app.set('query parser', (str: string) => {
        return qs.parse(str, {});
    });
}

export default configQueryParser;