# Shortify - URL Shortener Web Application

## Description

Shortify is a simple and efficient web-based URL shortener that allows users to create short, shareable links from long
URLs. Built using the MERN stack (MongoDB, Express, React, Node.js) and styled with Chakra UI, Shortify provides a
seamless and user-friendly experience for link management.

## Features

- Shorten URLs: Instantly convert long URLs into short, easy-to-share links.
- Custom Short Links: Create personalized and memorable short URLs
- Copy to Clipboard: Easily copy shortened URLs with a single click.

## Installation

To run the URL Shortener Web Application locally, follow these steps:

1. Clone the repository:

2. Install dependencies for both frontend and backend:

```cd shortify-server```
```npm install```
```cd shortify-ui```
```npm install```

4. Set up environment variables:

- Create a `.env` file in the root directory for shortify-server and add the following:
  ```
  DB_URL=your-mongodb-url
  BASE_URI=your-server-uri
  PORT=your-port-number
  ```

- Create a `.env` file in the root directory for shortify-ui and add the following:
  ```
  VITE_APP_URI=your-shortify-server-uri
  ```
  
4. Start the development server:

-Shortify Server ```npm start```
-Shortify UI ```npm start```

The URL Shortener Web Application will be running on `http://localhost:your-port-number`.

## Usage

1. Access the application at `http://localhost:your-port-number` in your web browser.
2. Enter the long URL you want to shorten in the input field.
3. Optionally, you can provide a custom short URL code for the link.
4. Click the "Generate Shorten Link" button to generate the shortened version.
5. The shortened URL will be displayed in the output field, and it will be automatically copied to your clipboard for
   easy sharing.

## Technologies Used

- Frontend:
- React
- Chakra UI
- React Router
- Axios

- Backend:
- Node.js
- Express
- MongoDB (via Mongoose)

## Deployment

- Backend: Deployed on [Render](https://render.com)
- Frontend: Deployed on [Vercel](https://vercel.com)

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please create a new issue or
submit a pull request.

## Contact

For any inquiries or questions, feel free to reach out via [email](benammarslim1996@gmail.com) or connect with me
on [LinkedIn](https://www.linkedin.com/in/slim-ben-ammar).
