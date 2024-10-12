# 3813ICT Assessment Phase 1

## Table of Contents
1. [Git Repository Structure](#git-repository-structure)
   - [Repository Organisation](#repository-organisation)
   - [3813ICT-Assessment](#3813ict-assessment)
   - [Server](#server)
2. [Git Workflow](#git-workflow)
   - [Branching Strategy](#branching-strategy)
   - [Commit Frequency](#commit-frequency)
3. [JSON File Structure](#json-file-structure)
   - [User Data Structure](#user-data-structure)
   - [Group Data Structure](#group-data-structure)
   - [Request Data Structure](#request-data-structure)
4. [MongoDB Collection Structure](#mongodb-collection-structure)
   - [Channels Collection](#channels-collection)
   - [Messages Collection](#messages-collection)
   - [Profile Pictures Collection](#profile-pictures-collection)
5. [Angular Architecture](#angular-architecture)
   - [Components](#components)
   - [Services](#services)
   - [Models](#models)
6. [REST API, Node Server Architecture, and Server-Side Routes](#rest-api-node-server-architecture-and-server-side-routes)
   - [Node Server Architecture](#node-server-architecture)
   - [Server Directory Structure](#server-directory-structure)
   - [REST API](#rest-api)
   - [Server-Side Routes](#server-side-routes)
     - [channelRoutes.js](#channelroutesjs)
     - [groupsRoutes.js](#groupsroutesjs)
     - [requestsRoutes.js](#requestsroutesjs)
     - [usersRoutes.js](#usersroutesjs)
7. [How Data Was Changed and Updated](#how-data-was-changed-and-updated)
8. [Testing](#testing)
   - [Angular Unit Testing](#angular-unit-testing)
   - [Mocha + Chai Testing on Node Server](#mocha--chai-testing-on-node-server)



## Git Repository Structure
### Repository organisation
This repository includes all essential files for running the chat application project, excluding the node modules which can be installed using npm install (or npm i).
#### 3813ICT-Assessment
The `3813ICT-Assessment` directory contains the Angular project files for the frontend component. Within the `src` folder inside `3813ICT-Assessment`, the `app` directory houses a critical file named `main.ts`, which manages the Angular project's routing and paths. The `app` folder also contains two key subdirectories: `components` and `services`. The `components` directory stores all Angular components required for the frontend, while the `services` directory contains the service files that handle HTTP posts to the Node server as well as the socket functions. Each component and services will be broken down and explained in this Angular Achitecture section.

#### Server
The server is responsible for handling API requests and managing the backend logic. It serves as the intermediary between the Angular frontend and the MongoDB database. The server uses Node.js and Express to define routes for handling actions such as creating groups, managing user requests, and handling real-time chat functionality via sockets. It also manages data persistence by storing and retrieving information from the MongoDB database or JSON files during the project setup.


### Git Workflow
#### Branching Strategy
To ensure a stable main version of the project, I employed branching extensively. For each new feature, I created a dedicated branch with a descriptive name. Once the feature was completed, I merged the branch back into the main branch. Direct modifications to the main branch were infrequent and only done when absolutely necessary.


#### Commit Frequency
To ensure a stable main version of the project, I employed branching extensively. For each new feature, I created a dedicated branch with a descriptive name. Once the feature was completed, I merged the branch back into the `main` branch. Direct modifications to the `main` branch were infrequent and only done when absolutely necessary.

## JSON File Strucutre


### User Data Structure
User data is stored within the `users.json` file. The `users.json` file contains objects representing all the users of the application. When a new user is created, an extra object is added to the end of the file. Each user object contains the following six attributes
#### Fields:
* **userId**: A unique identifier for each user (e.g., u001).
* **username**: A unique username selected by the user.
* **password**: A password chosen by the user for account login.
* **email**: The email address provided during account creation.
* **roles**: An array that stores the user's roles (e.g., user, groupAdmin, superAdmin).
* **groups**: An array listing the names of the groups the user belongs to.

### Group Data Structure
Group data is stored within the `groups.json` file. The `groups.json` file contains objects representing all the groups in the project. When a new group is created, a new object is added to the bottom of the file with the new group's information stored inside. Each object includes the following three attributes:
#### Fields:
* **name**: The name of the group.
* **admins**: An array of objects containing information about each group admin, including `userId`, `username`, and `role` (either creator or admin).
* **creatorId**: This id refers to the `userId` of the admin that created the group.

### Request Data Structure
The request data is stored within the `requests.json` file, which contains objects representing all the requests made by users and group admins. When a new request is created, it is added to the file with its details stored inside the corresponding object. Each request object includes the following attributes:
#### Fields:
* **username (mandatory)**: This value corresponds to the user who created the request.
* **groupName (mandatory)**: This value corresponds to the group in which the request has been made or is for joining.
* **typeOfRequest (mandatory)**: This value can have one of three possible values—`report`, `promotion`, or `join`. A `report` request means that a user has reported another user within a group. A `promotion` request means that a current group admin is requesting that another user be promoted to group admin. A `join` request means a user is requesting to join a group.
* **reportedUsername (mandatory for report requests)**: This value stores the username of the user who has been reported.
* **reason (mandatory for report requests)**: This value stores a string corresponding to the reason for the report.
* **promotionUser (mandatory for promotion requests)**: This value stores the username of the user that a group admin wishes to promote to group admin.

## MongoDB Collection Structure

Three collections were used in this project, each serving a different purpose to manage the data of the application. This section breaks down the variables in each collection and describes their role in the project.

### Channels Collection

The **channels** collection is responsible for storing data related to all channels created within the project. Channels allow users to communicate with each other using real-time chat functionality. Each document in the collection represents a single channel, including information about which group it belongs to and other metadata.

#### Fields:
- **_id**: An ObjectId generated automatically by MongoDB to uniquely identify each channel document.
- **groupName**: The name of the group to which this channel belongs. This helps in associating channels with their respective groups.
- **name**: The name of the channel, which will be displayed to users within the group.
- **description**: A brief description of what the channel is about, giving context to users about its purpose.

### Messages Collection

The **messages** collection stores all the messages sent within the channels of various groups. Each document represents an individual message, containing information about the group, channel, sender, and other relevant details. This collection helps track and retrieve the message history within specific channels.

#### Fields:
- **_id**: An ObjectId generated by MongoDB, uniquely identifying each message.
- **groupName**: The name of the group where the message was sent, used to associate the message with its group.
- **channelName**: The name of the channel where the message was sent, allowing for precise retrieval of message history per channel.
- **sender**: The username of the user who sent the message.
- **content**: The actual text content of the message. If the message contains only an image, this field may be empty or null.
- **imageUrl**: If the message contains an image, this field stores the URL or file path to the image. If the message is text-only, this field is null.
- **timestamp**: The date and time when the message was sent, allowing messages to be displayed with their sent time next to it.

### Profile Pictures Collection

The **profilePictures** collection stores the profile picture data for users in the application. Each document represents a user’s profile picture, which is used in various parts of the application (e.g., next to messages they send in chat).

#### Fields:
- **_id**: An ObjectId generated by MongoDB, uniquely identifying each profile picture document.
- **username**: The username of the user to whom the profile picture belongs.
- **profilePicture**: The file path referencing to the location of the user’s profile picture in the server’s `uploads/profile-pictures` directory.


## Angular Architecture
### Components
This project contains seven core components that make up the entire frontend of the project. These components are:
* **account**: This component allows users to view their account details (username and email) and upload a profile picture. It also provides two buttons: one for logging out and another for deleting their account.
* **all-group-list**: Displays all existing groups, allowing users to request to join any group they are not already part of. These requests must be approved by a group admin. This component isn’t shown to super admins as they can already see all the groups in the program in the `user-group` component.
* **channel**: This component allows users to chat with other members of the group in real time through the use of sockets. The user can send messages via both text and images. When a message is sent in the chat box, the profile picture of the user is displayed next to the message as well as the time the message was sent. Super admins also have a delete button next to each message they can use to remove a message.
* **inbox**: This component is visible only to group admins and super admins. Group admins can use it to view and manage pending group requests. Super admins have access to two additional tabs: one for report requests, where they can see users who have been reported in channels, and another for promotion requests, where they can manage requests to promote users to group admins.
* **login**: Enables users to log in by entering their credentials, which are checked against the data stored in the `user.json` file.
* **register**: Allows users to create an account by entering a unique username, email, and password.
* **user-group**: This screen is displayed after a user logs in. It shows the groups that the user has joined. Group admins have additional options to create and delete groups and channels, but they can only modify groups they have created. Super admins have the same abilities but can modify any group without needing to be the creator.


### Services
Within this project, five services were created to manage data and provide methods for performing various actions on that data. Each service calls the appropriate route on the Node.js server to perform the required operation.

* `channels.service.ts`: Manages the channel-related operations, such as fetching and creating channels by calling the respective API routes on the Node server.
* `groups.service.ts`: Responsible for handling group-related operations, including creating and deleting groups by making requests to the Node server's group management routes.
* `requests.service.ts`: Manages user requests, such as join requests, promotion requests, and report requests by interacting with the relevant Node.js API routes.
* `sockets.service.ts`: Provides functionality for handling real-time communication using sockets for the chat feature by connecting to the Node.js socket endpoints.
* `users.service.ts`: Handles operations related to user data, such as fetching user information, updating profiles, and managing user roles by making API calls to the user-related routes on the Node server.


### Models
The models in this project define the structure of data objects used throughout the Angular application. Below is a breakdown of the key models and their attributes:

* **channel.component.ts**:
  * `message`: Represents a message sent within a channel.
    * **_id**: A unique identifier for each message, generated by MongoDB.
    * **groupName**: The name of the group to which the message belongs.
    * **channelName**: The name of the channel in which the message was sent.
    * **sender**: The username of the user who sent the message.
    * **content**: The text content of the message.
    * **imageUrl**: The URL or file path for any image included in the message.
    * **timestamp**: The date and time when the message was sent.
    
  * `GroupUser`: Represents a user within a group.
    * **userId**: A unique identifier for the user.
    * **username**: The username of the user.
    * **profilePicture**: The file path to the user’s profile picture.

* **channel.services.ts**:
  * `Channel`: Represents a channel within a group.
    * **name**: The name of the channel.
    * **description**: A brief description of the channel’s purpose.

* **groups.services.ts**:
  * `Admin`: Represents an admin within a group.
    * **userId**: A unique identifier for the admin.
    * **username**: The username of the admin.
    * **role**: The role of the user within the group, either `admin` or `creator`.
    * **profilePicture**: The file path to the admin’s profile picture.
    
  * `Group`: Represents a group in the application.
    * **name**: The name of the group.
    * **admins**: An array of `Admin` objects representing the group’s administrators.
    * **creatorId**: The unique identifier of the user who created the group.


## REST API, Node Server Architecture, and Server-Side Routes

This project uses a Node.js server to handle API requests and manage backend logic. The server is organized to separate concerns and handle different aspects of the application's functionality, as outlined below.

### Node Server Architecture

The backend of this project is built using Node.js and is structured to manage various responsibilities like handling requests, managing data, and serving responses to the frontend. The server is organized into several key directories to streamline functionality.

### Server Directory Structure
The server directory is organized to separate concerns and handle different aspects of the application backend. Below is an overview of the key folders and files:
- **controllers/**: This directory contains files responsible for handling the logic of various routes and managing the interaction between the routes and the data stored in the `data` folder.
  - `channelsController.js`: Handles channel-related logic, such as managing channels within groups.
  - `groupsController.js`: Manages logic for group-related actions like creating or deleting groups.
  - `requestsController.js`: Handles logic for user requests, such as group join requests, promotion requests, and report requests.
  - `usersController.js`: Manages user-related logic, such as adding users to groups or promoting a user.
- **data/**: This directory stores JSON files that represent the database for the application. These files are used to store data such as groups, users, and requests.
  - `groups.json`: Stores all group-related data.
  - `groupsWithChannels.json`: Stores group data, including channel information.
  - `requests.json`: Stores all user requests, including join, promotion, and report requests.
  - `users.json`: Stores user-related data, such as username, roles, and group memberships.
  - Backup files (`groups-backup.json`, `users-backup.json`) provide backup versions of the `groups` and `users` data.

- **helpers/**: Contains utility functions that assist with server operations. 
  - `fileHelper.js`: A file used to read and write file operations on a JSON file.
- **routes/**: Contains the route definitions for different parts of the application, specifying how incoming requests are handled and directing them to the appropriate controllers.
  - `channelsRoutes.js`: Defines routes related to channel operations.
  - `groupsRoutes.js`: Defines routes for group-related actions.
  - `requestsRoutes.js`: Defines routes for handling user and admin requests.
  - `usersRoutes.js`: Defines routes for user management actions.
- **uploads/**: This folder contains directories for storing uploaded images such as:
  - `messages/`: Stores any image sent in a channel
  - `profile-pictures/`: Stores the images for user’s profile pictures
- **migrateChannels.js**: This script is responsible for migrating the channel data inside the `groupsWithChannels.json` into the MongoDB for initial project setup.
- **server.js**: The entry point for the Node.js server. It initializes the server, sets up middleware, and connects the routes to the appropriate controllers.
- **db.js**: Responsible for setting up and managing the connection to MongoDB database 
- **package.json & package-lock.json**: These files list the project dependencies and manage version control for those dependencies.

### REST API
In this project, I utilized the REST API architecture to handle communication between the Angular frontend and the Node.js server. By following REST principles, each route corresponds to a specific HTTP method—`GET`, `POST`, `PATCH`, `DELETE`—and operates on distinct resources such as users, groups, and channels. This structuring ensures the server routes are easy to maintain and scale.

Each resource is represented by a clear URL endpoint, and actions such as retrieving data, creating new records, updating existing entries, and deleting resources are managed through these API endpoints. For example:

- **GET** requests are used to fetch data, like retrieving a list of groups or fetching all messages in a channel.
- **POST** requests are used to create new data, such as creating a new group or sending a chat message.
- **PATCH** requests are used to update existing data, such as promoting a user to an admin role or adding a group to a user's list.
- **DELETE** requests are used to remove data, like deleting a user or removing a channel from a group.

By adhering to REST API principles, the server-side logic becomes more intuitive, stateless, and scalable, allowing each API route to manage a specific function effectively and enabling clear communication between the client and server.

### Server Side Routes

#### channelRoutes.js
  
* **GET `/group/:groupName`**
  - **HTTP Method**: GET
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group whose channels are being fetched.
  - **Return**:
    - Success: An array of channel objects associated with the specified group.
    - Error: `{ "error": "Failed to get channels." }`
  - **Purpose**: Fetches all the channels associated with the specified group from the database.

* **POST `/`**
  - **HTTP Method**: POST
  - **Parameters**:
    - `groupName` (body parameter): The name of the group where the new channel is being created.
    - `name` (body parameter): The name of the new channel.
    - `description` (body parameter): A description of the channel.
  - **Return**:
    - Success: `{ "message": "Channel created successfully." }`
    - Error: `{ "error": "Failed to create channel." }`
  - **Purpose**: Creates a new channel within the specified group and stores the channel data in the database.

* **DELETE `/:groupName/:channelName`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group.
    - `:channelName` (URL parameter): The name of the channel to be deleted.
  - **Return**:
    - Success: `{ "message": "Channel and its messages deleted successfully." }`
    - Error: `{ "error": "Channel not found." }`
  - **Purpose**: Deletes the specified channel and all associated messages from the database.

* **GET `/:groupName/:channelName/messages`**
  - **HTTP Method**: GET
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group.
    - `:channelName` (URL parameter): The name of the channel whose messages are being fetched.
  - **Return**:
    - Success: An array of message objects.
    - Error: `{ "error": "Failed to get messages." }`
  - **Purpose**: Fetches all the chat messages associated with the specified channel.

* **POST `/:groupName/:channelName/messages`**
  - **HTTP Method**: POST
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group.
    - `:channelName` (URL parameter): The name of the channel.
    - `sender` (body parameter): The username of the user sending the message.
    - `content` (body parameter): The text content of the message (optional if an image is uploaded).
    - `image` (file parameter): The image file associated with the message (optional).
  - **Return**:
    - Success: `{ "message": "Message added successfully." }`
    - Error: `{ "error": "Failed to add message." }`
  - **Purpose**: Adds a new message (with optional image) to the specified channel.

* **DELETE `/messages/:groupName/:channelName/:messageId`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group.
    - `:channelName` (URL parameter): The name of the channel.
    - `:messageId` (URL parameter): The ID of the message to be deleted.
  - **Return**:
    - Success: `{ "message": "Message deleted successfully." }`
    - Error: `{ "error": "Message not found." }`
  - **Purpose**: Deletes a specific message from the specified channel.
 
#### groupsRoutes.js

* **GET `/`**
  - **HTTP Method**: GET
  - **Parameters**: None
  - **Return**:
    - Success: An array of all group objects.
    - Error: `{ "error": "Failed to read groups data." }`
  - **Purpose**: Fetches a list of all groups.

* **GET `/:groupName`**
  - **HTTP Method**: GET
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group whose details are being fetched.
  - **Return**:
    - Success: The details of the specified group.
    - Error: `{ "error": "Group with name \"<groupName>\" not found." }` or other error messages.
  - **Purpose**: Fetches the details of a specific group by its name.

* **POST `/`**
  - **HTTP Method**: POST
  - **Parameters**:
    - `groupName` (body parameter): The name of the new group.
    - `creatorUsername` (body parameter): The username of the group’s creator.
    - `creatorId` (body parameter): The user ID of the group’s creator.
  - **Return**:
    - Success: `{ "message": "New group created successfully." }`
    - Error: `{ "error": "Group already exists." }` or other error messages.
  - **Purpose**: Creates a new group and adds it to the `groups.json` file and updates the creator’s group array in `users.json`.

* **DELETE `/:groupName`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group to be deleted.
  - **Return**:
    - Success: `{ "message": "Group, all associated channels, and messages deleted successfully." }`
    - Error: `{ "error": "Group not found." }` or other error messages.
  - **Purpose**: Deletes a group by name, removes all associated channels and messages, and updates users’ group arrays.

* **PATCH `/add-group-to-user/:username`**
  - **HTTP Method**: PATCH
  - **Parameters**:
    - `:username` (URL parameter): The username of the user to whom the group will be added.
    - `groupName` (body parameter): The name of the group to be added.
  - **Return**:
    - Success: `{ "message": "Group added to user successfully." }`
    - Error: `{ "error": "User is already in this group." }` or other error messages.
  - **Purpose**: Adds a specified group to a user's `groups` array if they are not already part of the group.

* **POST `/:groupName/leave`**
  - **HTTP Method**: POST
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group to leave.
    - `userId` (body parameter): The ID of the user leaving the group.
  - **Return**:
    - Success: `{ "message": "Successfully left the group <groupName>." }`
    - Error: `{ "error": "User not found." }` or other error messages.
  - **Purpose**: Removes a group from a user's `groups` array when the user leaves the group.

* **GET `/:groupName/users`**
  - **HTTP Method**: GET
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group whose users are being fetched.
  - **Return**:
    - Success: An array of users in the specified group.
    - Error: `{ "error": "Failed to read users data." }`
  - **Purpose**: Fetches a list of all users in a specific group.

* **GET `/:groupName/admins`**
  - **HTTP Method**: GET
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group whose admins are being fetched.
  - **Return**:
    - Success: An array of admin objects for the specified group.
    - Error: `{ "error": "Group not found." }`
  - **Purpose**: Fetches a list of all admins in a specific group.

* **DELETE `/groups/:groupName/users/:username`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group from which the user will be removed.
    - `:username` (URL parameter): The username of the user to remove from the group.
  - **Return**:
    - Success: `{ "message": "User removed from group successfully." }`
    - Error: `{ "error": "User not found." }` or other error messages.
  - **Purpose**: Removes a specified user from the group by updating the `groups` array in `users.json`.

#### requestsRoutes.js

* **POST `/`**
  - **HTTP Method**: POST
  - **Parameters**:
    - `username` (body parameter): The username of the user making the request.
    - `groupName` (body parameter): The name of the group related to the request.
    - `typeOfRequest` (body parameter): The type of request, which must be one of "join", "report", or "promotion".
    - `reportedUsername` (body parameter, for report requests): The username of the reported user.
    - `reason` (body parameter, for report requests): The reason for the report.
    - `promotionUser` (body parameter, for promotion requests): The username of the user to be promoted.
  - **Return**:
    - Success: `{ "message": "Request created successfully." }`
    - Error: `{ "error": "Duplicate request already exists." }` or other error messages.
  - **Purpose**: Creates a new request for joining a group, reporting a user, or promoting a user to admin.

* **GET `/`**
  - **HTTP Method**: GET
  - **Parameters**: None
  - **Return**:
    - Success: An array of all request objects.
    - Error: `{ "error": "Failed to read requests data." }`
  - **Purpose**: Retrieves all requests.

* **GET `/type`**
  - **HTTP Method**: GET
  - **Parameters**:
    - `type` (query parameter): The type of request to filter by (either "join", "report", or "promotion").
  - **Return**:
    - Success: An array of request objects filtered by the specified type.
    - Error: `{ "error": "Request type is required." }` or other error messages.
  - **Purpose**: Retrieves all requests of a specific type.

* **PATCH `/:id`**
  - **HTTP Method**: PATCH
  - **Parameters**:
    - `:id` (URL parameter): The ID of the request to update.
    - `status` (body parameter): The new status for the request.
  - **Return**:
    - Success: `{ "message": "Request status updated successfully." }`
    - Error: `{ "error": "Request not found." }` or other error messages.
  - **Purpose**: Updates the status of a request by its ID.

* **DELETE `/`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `username` (body parameter): The username of the user who made the request.
    - `groupName` (body parameter): The name of the group associated with the request.
    - `typeOfRequest` (body parameter): The type of request to be deleted (either "join", "report", or "promotion").
  - **Return**:
    - Success: `{ "message": "Request deleted successfully." }`
    - Error: `{ "error": "Request not found." }` or other error messages.
  - **Purpose**: Deletes a request based on the username, group name, and request type.

* **DELETE `/group/:groupName`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `:groupName` (URL parameter): The name of the group whose pending requests are being removed.
  - **Return**:
    - Success: `{ "message": "Pending requests removed successfully." }`
    - Error: `{ "error": "No pending requests found for the specified group." }`
  - **Purpose**: Removes all pending requests for a specific group.

* **DELETE `/user/:username`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `:username` (URL parameter): The username of the user whose pending requests are being removed.
  - **Return**:
    - Success: `{ "message": "Pending requests for the user removed successfully." }`
    - Error: `{ "error": "No pending requests found for the specified user." }`
  - **Purpose**: Removes all pending requests for a specific user.

#### usersRoutes.js

* **GET `/`**
  - **HTTP Method**: GET
  - **Parameters**: None
  - **Return**:
    - Success: An array of all user objects.
    - Error: `{ "error": "Failed to read users data." }`
  - **Purpose**: Fetches a list of all users.

* **POST `/`**
  - **HTTP Method**: POST
  - **Parameters**:
    - `username` (body parameter): The username of the new user.
    - `password` (body parameter): The password for the new user.
    - Other user-specific fields as required.
  - **Return**:
    - Success: `{ "message": "User created successfully." }`
    - Error: `{ "error": "Username already exists." }` or other error messages.
  - **Purpose**: Creates a new user and adds them to the `users.json` file.

* **PUT `/save`**
  - **HTTP Method**: PUT
  - **Parameters**:
    - An array of user objects (body parameter).
  - **Return**:
    - Success: `{ "message": "Users saved successfully." }`
    - Error: `{ "error": "Failed to save users." }`
  - **Purpose**: Saves the updated list of users to the `users.json` file.

* **DELETE `/username/:username`**
  - **HTTP Method**: DELETE
  - **Parameters**:
    - `:username` (URL parameter): The username of the user to delete.
  - **Return**:
    - Success: `{ "message": "User deleted successfully." }`
    - Error: `{ "error": "User not found." }`
  - **Purpose**: Deletes a user by their username.

* **GET `/superAdmins`**
  - **HTTP Method**: GET
  - **Parameters**: None
  - **Return**:
    - Success: An array of super admin objects.
    - Error: `{ "error": "Failed to read users data." }`
  - **Purpose**: Retrieves a list of all users with the `superAdmin` role.

* **PATCH `/promote/groupAdmin/:username`**
  - **HTTP Method**: PATCH
  - **Parameters**:
    - `:username` (URL parameter): The username of the user to promote to group admin.
  - **Return**:
    - Success: `{ "message": "User promoted to Group Admin successfully." }`
    - Error: `{ "error": "User not found." }`
  - **Purpose**: Promotes a user to the `groupAdmin` role.

* **PATCH `/promote/superAdmin/:username`**
  - **HTTP Method**: PATCH
  - **Parameters**:
    - `:username` (URL parameter): The username of the user to promote to super admin.
  - **Return**:
    - Success: `{ "message": "User promoted to Super Admin successfully." }`
    - Error: `{ "error": "User not found." }`
  - **Purpose**: Promotes a user to the `superAdmin` role.

* **POST `/upload-profile-picture`**
  - **HTTP Method**: POST
  - **Parameters**:
    - `username` (body parameter): The username of the user uploading the profile picture.
    - `image` (file parameter): The image file of the user's profile picture.
  - **Return**:
    - Success: `{ "imageUrl": "<URL of uploaded profile picture>", "message": "Profile picture uploaded successfully." }`
    - Error: `{ "error": "Failed to upload profile picture." }`
  - **Purpose**: Uploads a user's profile picture, saves it in the `uploads/profile-pictures` directory, and stores the URL in MongoDB.

* **GET `/profile-picture/:username`**
  - **HTTP Method**: GET
  - **Parameters**:
    - `:username` (URL parameter): The username of the user whose profile picture is being fetched.
  - **Return**:
    - Success: `{ "imageUrl": "<URL of the user's profile picture>" }`
    - Error: `{ "error": "Failed to get profile picture." }`
  - **Purpose**: Retrieves the profile picture URL for a specific user from MongoDB. If no picture exists, it returns a default image URL.

## Testing
### Angular Unit Testing
To run these tests, cd into `3813ICT-Assessment` and run ng test. You will need to do npm i to install any dependencies.
#### Components
* account component:**
    * should create the AccountComponent
    * should alert if no file is selected during profile picture upload
    * should upload profile picture and update the component state on success
    * should handle error during profile picture upload
* login component:**
    * should create the login component
    * should navigate to /user-group on successful login
    * should alert "Invalid credentials" if username or password is incorrect
    * should alert an error if getValidUsers fails

#### Services
* **channels services:**
    *  should be created
    *  should fetch channels by group name
    *  should create a new channel
    *  should delete a channel
    *  should add a message to a channel
    *  should fetch messages for a channel
    *  should delete a message from a channel
* **groups.service.ts:** 
    *  should be created
    *  should fetch all groups
    *  should fetch the group creator
    *  should create a new group
    *  should delete a group
    *  should fetch users in a group
    *  should fetch admins of a group
    *  should add a group to a user
    *  should leave a group
    *  should kick a user from a group
* **requests.service.ts:**
    *  should be created
    *  should create a join request
    *  should create a report request
    *  should fetch all requests
    *  should fetch requests by type
    *  should update the request status
    *  should delete a request by details
    *  should return the request count

### Mocha + Chai testing on Node Server
to run these tests cd into server and enter npm test. You will need to run npm i to install dependencies.
* **channels.test.js:**
    *  should return all channels for a given group name
    *  should create a new channel
    *  should delete a channel and its messages
    *  should return all messages for a given channel
    *  should add a new message to the channel
    *  should delete a specific message by messageId
* **groups.test.js:** none
* **request.test.js:** none
* **users.test.js:** none
 
## How Data Was Changed and Updated
Whenever a user action required data modification—such as updating user roles, adding a new group, or processing a request—these methods would first perform the necessary changes to the data stored in local storage or the database via API calls. After updating the data, the methods would then trigger a refresh of the Angular components to update the views. Additionally, real-time updates, such as new messages in the chat, were handled using Socket.IO to ensure seamless user experience without manual refreshes.

