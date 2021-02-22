# Student notes

## GitHub 
- Two branches.  One called _dev_ for development and another called _main_ (AKA master)
- Main requires review before merging.
- Merging dev to main to get the prod version.

## Development Server

### Building
- Since I am using windows, I had to modify the package.json build to make it work in my environment.  I left a copy of the original build command for unix-like envs.

```json
"build": "npm run clean && tsc && copy package.json www\\package.json && mkdir www\\tmp\\ && cd www && 7z u -tzip Archive.zip . && cd ..",
"build-original": "npm run clean && tsc && cp package.json www/package.json && mkdir www/tmp/ && cd www && zip -r Archive.zip . && cd ..",
```

### RESTFUL design

- _/filteredimage_ Get method as requested in the instructions.
  - Validate _image_url_ is required.
  - _Unprocessable Entity_ when URL either invalid or not existing.
  - Delete image after return.
- _/filteredimageauth_ Get method same as  _filteredimage_ but requires a JWT authentication.
- _/token/:user_  Post method that returns a JWT token for a given a user.

### HTTP status codes

Using library to avoid magic number 
```typescript 
import {
  StatusCodes,
  ReasonPhrases
} from 'http-status-codes';
```

## Elastic Beanstalk Deployment

- Project built and deployed to EB using *eb init*, *eb create*, *eb deploy*
- Screenshots:  https://github.com/henrysmith/udragram-hsmith-udacity/tree/main/deployment_screenshots

## Stand Out (Optional)

- Refactor to post to make a call to the provisioned image server.
- Authentication
  - Added Get Post method to return a JWT token.
  - Added Method to validate and verify the JWT token provided.
  - Postman collection updated.
  - Added Postman test for the new endpoints and the required features.

# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. [Covered in the course]
2. [The RestAPI Backend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-restapi), a Node-Express server which can be deployed to a cloud service. [Covered in the course]
3. [The Image Filtering Microservice](https://github.com/udacity/cloud-developer/tree/master/course-02/project/image-filter-starter-code), the final project for the course. It is a Node-Express application which runs a simple script to process images. [Your assignment]

## Tasks

### Setup Node Environment

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`

### Create a new endpoint in the server.ts file

The starter code has a task for you to complete an endpoint in `./src/server.ts` which uses query parameter to download an image from a public URL, filter the image, and return the result.

We've included a few helper functions to handle some of these concepts and we're importing it for you at the top of the `./src/server.ts`  file.

```typescript
import {filterImageFromURL, deleteLocalFiles} from './util/util';
```

### Deploying your system

Follow the process described in the course to `eb init` a new application and `eb create` a new environment to deploy your image-filter service! Don't forget you can use `eb deploy` to push changes.

## Stand Out (Optional)

### Refactor the course RESTapi

If you're feeling up to it, refactor the course RESTapi to make a request to your newly provisioned image server.

### Authentication

Prevent requests without valid authentication headers.
> !!NOTE if you choose to submit this, make sure to add the token to the postman collection and export the postman collection file to your submission so we can review!

### Custom Domain Name

Add your own domain name and have it point to the running services (try adding a subdomain name to point to the processing server)
> !NOTE: Domain names are not included in AWS’ free tier and will incur a cost.
