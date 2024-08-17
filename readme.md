# VideoTube

VideoTube is a video-sharing platform that allows users to upload, view, and share videos. The platform features a user-friendly interface, advanced video encoding, and real-time streaming, making it easy for users to access content across various devices. Whether you're a content creator or a viewer, VideoTube offers a seamless experience to engage with video content. [![Project Model](https://img.shields.io/badge/Project%20Model-View%20Here-brightgreen)](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

## Features

- **User Authentication:** Secure sign-up, login, and profile management.
- **Video Upload & Encoding:** Supports multiple video formats with automatic encoding for optimized playback.
- **Commenting & Likes:** Engage with content through comments and likes.
- **Tweet** Create a tweet, update, delete; express your thoughts.

## Tech Stack

- **Backend:**
  - **Node.js & Express.js:** Server-side development with RESTful APIs.
  - **MongoDB:** NoSQL database for storing user data, video metadata, and comments.
  - **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
  - **JWT:** JSON Web Tokens for secure authentication and authorization.
  - **Cloudinary:** Upload video and image on Cloudinary.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/isanjeevroy/videotube.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd videotube
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add your MongoDB URI and Cloudinary credentials environment variables.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
6. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements, bug fixes, or new features.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

For any inquiries or support, please reach out to @isanjeevroy.
