# Social Media API

A RESTful API for a social media platform with features for posts, users, comments, likes, and saved posts.

## Features

- **Users**: Registration, authentication, profile management
- **Posts**: Create, read, update, delete posts
- **Comments**: Add comments to posts
- **Likes**: Like/unlike posts and get like counts
- **Saved Posts**: Save posts for later viewing

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/social-media
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/users/register`
- Body: `{ name, username, email, password, phoneNumber }`
- Response: User object and JWT token

#### Login User
- **POST** `/api/users/login`
- Body: `{ email, password }`
- Response: User object and JWT token

### Users

#### Get User Profile
- **GET** `/api/users/:id`
- Headers: `Authorization: Bearer <token>`
- Response: User profile

#### Update User Profile
- **PUT** `/api/users/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ name, username, email, phoneNumber }`
- Response: Updated user profile

### Posts

#### Get All Posts
- **GET** `/api/posts`
- Response: Array of all posts

#### Get Single Post
- **GET** `/api/posts/:id`
- Response: Single post with details

#### Create Post
- **POST** `/api/posts`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, content, description, photo }`
- Response: Created post

#### Update Post
- **PUT** `/api/posts/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ title, content, description, photo }`
- Response: Updated post

#### Delete Post
- **DELETE** `/api/posts/:id`
- Headers: `Authorization: Bearer <token>`
- Response: Success message

#### Get Posts by User
- **GET** `/api/posts/user/:userId`
- Response: Array of posts by specific user

### Comments

#### Get Comments for Post
- **GET** `/api/comments/post/:postId`
- Response: Array of comments for a post

#### Create Comment
- **POST** `/api/comments`
- Headers: `Authorization: Bearer <token>`
- Body: `{ postId, text }`
- Response: Created comment

#### Update Comment
- **PUT** `/api/comments/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ text }`
- Response: Updated comment

#### Delete Comment
- **DELETE** `/api/comments/:id`
- Headers: `Authorization: Bearer <token>`
- Response: Success message

#### Get Comments by User
- **GET** `/api/comments/user/:userId`
- Response: Array of comments by specific user

### Likes

#### Like/Unlike Post
- **POST** `/api/likes`
- Headers: `Authorization: Bearer <token>`
- Body: `{ postId }`
- Response: Like status and like object

#### Get Likes for Post
- **GET** `/api/likes/post/:postId`
- Response: Array of likes for a post

#### Get Like Count for Post
- **GET** `/api/likes/count/:postId`
- Response: Like count

#### Check if User Liked Post
- **GET** `/api/likes/check/:postId`
- Headers: `Authorization: Bearer <token>`
- Response: Boolean indicating if user liked the post

#### Get Likes by User
- **GET** `/api/likes/user/:userId`
- Response: Array of likes by specific user

### Saved Posts

#### Save/Unsave Post
- **POST** `/api/saved`
- Headers: `Authorization: Bearer <token>`
- Body: `{ postId }`
- Response: Save status and saved post object

#### Get Saved Posts for User
- **GET** `/api/saved/user/:userId`
- Headers: `Authorization: Bearer <token>`
- Response: Array of saved posts

#### Check if Post is Saved
- **GET** `/api/saved/check/:postId`
- Headers: `Authorization: Bearer <token>`
- Response: Boolean indicating if post is saved

#### Delete Saved Post
- **DELETE** `/api/saved/:id`
- Headers: `Authorization: Bearer <token>`
- Response: Success message

## Data Models

### User
- `id`: ObjectId
- `name`: String
- `username`: String (unique)
- `email`: String (unique)
- `password`: String (hashed)
- `phoneNumber`: String (optional)

### Post
- `postId`: ObjectId
- `userId`: ObjectId (ref: User)
- `title`: String
- `content`: String
- `description`: String
- `photo`: String (optional)
- `likes`: Array of ObjectId (ref: Like)
- `comments`: Array of ObjectId (ref: Comment)

### Like
- `count`: Number (default: 1)
- `userId`: ObjectId (ref: User)
- `postId`: ObjectId (ref: Post)

### Comment
- `userId`: ObjectId (ref: User)
- `text`: String
- `likes`: Array of ObjectId (ref: Like)

### SavedPost
- `userIds`: ObjectId (ref: User)
- `postId`: ObjectId (ref: Post)
- `likes`: Array of ObjectId (ref: Like)
- `comments`: Array of ObjectId (ref: Comment)

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in JSON format:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- User authorization checks for post/comment/like modifications
- Input validation and sanitization

## License

ISC