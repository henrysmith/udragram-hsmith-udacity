import express from 'express';
import { Request, Response } from 'express'
import {
  StatusCodes,
  ReasonPhrases
} from 'http-status-codes';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, getParameter, requireAuth, generateJWT } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMETERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Uses query parameter to download an image from a public URL, filter the image, and return the result.
  // QUERY PARAMETER
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //    the filtered image file (JPEG, resize[256, 256], greyscale)
  app.get("/filteredimage", async (req, res) => runFilteredImage(req, res));

  // Uses query parameter to download an image from a public URL, filter the image, and return the result.
  // NOTE: Requires Bearer Authentication
  // QUERY PARAMETER
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //    the filtered image file (JPEG, resize[256, 256], greyscale)
  app.get("/filteredimageauth", requireAuth, async (req, res) => runFilteredImage(req, res));

  // Generates a token for a given username
  // QUERY PARAMETER
  //    user: any test that represents a user.
  // RETURNS
  //    JSON object containing the generated token.
  app.post("/token/:user", async (req, res) => {
    let { user } = req.params;    
    return res.status(StatusCodes.CREATED).contentType( "application/json").send({"access_token": generateJWT(user)});
  });

  var runFilteredImage = function (req: Request, res: Response) {
    return getParameter(req.query, "image_url")
      .then(image_url => filterImageFromURL(image_url))
      .then(fileURLToPath =>
        res.status(StatusCodes.CREATED).sendFile(fileURLToPath, { "Content-Type": "image/jpeg" }, () => deleteLocalFiles([fileURLToPath])))
      .catch(error => {
        console.error(error);
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(!!error.message ? ReasonPhrases.UNPROCESSABLE_ENTITY : error)
      });
  }

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();