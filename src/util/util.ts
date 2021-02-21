import { Request, Response } from 'express';
import fs from 'fs';
import Jimp = require('jimp');
import { NextFunction } from 'connect';
import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const photo = await Jimp.read(inputURL);
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(__dirname + outpath, (img) => {
                    resolve(__dirname + outpath);
                });
        } catch (error) {                        
            reject(error);            
        }
    } );
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}

// getParameter
// helper function to get a parameter from query string object
// if the parameter is not present then returns an exception.
// INPUTS
//    query: query parameter object.
//    parameterName: parameter expected.
//  RETURN
//    given parameter value in query string object.
//  EXCEPTIONS
//    Error on parameter undefined.
export function getParameter(query: any, parameterName: string ): Promise<string> {
    return new Promise(resolve => {
      let parameterValue = query[parameterName];
      if (!!parameterValue) {
        resolve(parameterValue);
      } else {
        throw `${parameterName} is required`;
      }
    });
  }

export function requireAuth(req: Request, res: Response, next: NextFunction) {

    if (!req.headers || !req.headers.authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'No authorization headers.' });
    }

    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Malformed token.' });
    }

    const token = token_bearer[1];

    return next();

    // return jwt.verify(token, "hello", (err, decoded) => {
    //   if (err) {
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ auth: false, message: 'Failed to authenticate.' });
    //   }
    //   return next();
    // });
}