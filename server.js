import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidURL} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get('/filteredimage', async (req, res) => {
    // Extracting the image URL from the query parameters
    const imageUrl = req.query.image_url;
  
    // Check if image URL is provided
    if (!imageUrl || !isValidURL(imageUrl)) {
      return res.status(400).json({ error: 'Image URL is missing or broken. Please provide a valid image URL.' });
    }
  
    try {
      // Call function to filter image from URL
      const filteredImagePath = await filterImageFromURL(imageUrl);
  
      // Send the filtered image file as a response
      res.sendFile(filteredImagePath, {}, (err) => {
        // Callback function to delete the filtered image file after it's sent
        if (err) {
          console.error('Error sending file:', err);
        } else {
          deleteLocalFiles([filteredImagePath]);
        }
      });
    } catch (error) {
      // Handle errors
      console.error('Error filtering image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
