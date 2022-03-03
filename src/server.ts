// tslint:disable-next-line: ordered-imports
import bodyParser from "body-parser";
import express from "express";
import { API_FILTER_IMAGE, BASE_URL, MSG } from "./constants";
// tslint:disable-next-line: ordered-imports
import { deleteLocalFiles, filterImageFromURL } from "./util/util";

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
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get(BASE_URL + API_FILTER_IMAGE, async (req, res) => {

    const image_url: string = req.query.image_url;

    if (image_url === "") {
      res.status(400).send(MSG.VALIDATION.IMAGE_URL_REQUIRED);
    }

    let downloadedPath = "";
    try {

      downloadedPath = await filterImageFromURL(image_url);
      if (downloadedPath) {
        await res.sendFile(downloadedPath, (err) => {
          if (err) {
            res.status(500).send(MSG.ERROR.IMAGE_URL_FAIL);
          } else {
            // clean downloaded file
            deleteLocalFiles([downloadedPath]);
          }
        });
      }

    } catch (error) {
      res.status(500).send(MSG.ERROR.IMAGE_URL_FAIL);
    }

  });
  // ! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get(BASE_URL, async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`server running http://localhost:${port}`);
    // tslint:disable-next-line: no-console
    console.log(`press CTRL+C to stop server`);
  });
})();
