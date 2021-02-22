import { Request, Response } from 'express';
import fs from 'fs';
import Jimp = require('jimp');
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';
import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';
import { config } from '../config/config';
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

// generateJWT
// Generates a JWT token for a given user.
// QUERY PARAMETER
//    userName: username
// RETURNS
//    A generated JWT token.
export function generateJWT(userName: string) : string {
       return jwt.sign(userName, config.jwt.secret);
}

// requireAuth
// Validated that a given request has a valid JWT token.
// PARAMETER
//    token_bearer: in the authorization header.
// RETURNS
//    Validate and user and move forward to the next function.
export function requireAuth(req: Request, res: Response, next: NextFunction) {

    if (!req.headers || !req.headers.authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'No authorization headers.' });
    }

    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Malformed token.' });
    }

    const token = token_bearer[1];

    return jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ auth: false, message: ReasonPhrases.UNAUTHORIZED });
      }
      return next();
    });
}