# 3813ICT Assessment Phase 1

## Git Repository Structure
### Repository Organization
This repository includes all essential files for running the chat application project, excluding the node modules which can be installed using npm install (or npm i).
#### 3813ICT-Assessment
The `3813ICT-Assessment` directory contains the Angular project files for the frontend component. Within the `src` folder inside `3813ICT-Assessment`, the `app` directory houses a critical file named `main.ts`, which manages the Angular project's routing and paths. The `app` folder also contains two key subdirectories: `components` and `services`. The `components` directory stores all Angular components required for the frontend, while the `services` directory contains the service files that handle HTTP posts to the Node server as well as the socket functions.
#### Server Directory Structure
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


### Git Workflow
#### Branching Strategy
To ensure a stable main version of the project, I employed branching extensively. For each new feature, I created a dedicated branch with a descriptive name. Once the feature was completed, I merged the branch back into the main branch. Direct modifications to the main branch were infrequent and only done when absolutely necessary.


#### Commit Frequency
To ensure a stable main version of the project, I employed branching extensively. For each new feature, I created a dedicated branch with a descriptive name. Once the feature was completed, I merged the branch back into the `main` branch. Direct modifications to the `main` branch were infrequent and only done when absolutely necessary.

## JSON File Strucutre


### User Data Structure
User data is stored within the `users.json` file. The `users.json` file contains objects representing all the users of the application. When a new user is created, an extra object is added to the end of the file. Each user object contains the following six attributes:
* `userId`: A unique identifier for each user (e.g., u001).
* `username`: A unique username selected by the user.
* `password`: A password chosen by the user for account login.
* `email`: The email address provided during account creation.
* `roles`: An array that stores the user's roles (e.g., user, groupAdmin, superAdmin).
* `groups`: An array listing the names of the groups the user belongs to.

### Group Data Structure
Group data is stored within the `groups.json` file. The `groups.json` file contains objects representing all the groups in the project. When a new group is created, a new object is added to the bottom of the file with the new group's information stored inside. Each object includes the following three attributes:
* `name`: The name of the group.
* `admins`: An array of objects containing information about each group admin, including `userId`, `username`, and `role` (either creator or admin).
* `creatorId`: This id refers to the `userId` of the admin that created the group.

### Request Data Structure
The request data is stored within the `requests.json` file, which contains objects representing all the requests made by users and group admins. When a new request is created, it is added to the file with its details stored inside the corresponding object. Each request object includes the following attributes:
* `username` (mandatory): This value corresponds to the user who created the request.
* `groupName` (mandatory): This value corresponds to the group in which the request has been made or is for joining.
* `typeOfRequest` (mandatory): This value can have one of three possible values—`report`, `promotion`, or `join`. A `report` request means that a user has reported another user within a group. A `promotion` request means that a current group admin is requesting that another user be promoted to group admin. A `join` request means a user is requesting to join a group.
* `reportedUsername` (mandatory for report requests): This value stores the username of the user who has been reported.
* `reason` (mandatory for report requests): This value stores a string corresponding to the reason for the report.
* `promotionUser` (mandatory for promotion requests): This value stores the username of the user that a group admin wishes to promote to group admin.

## Mongo DB Collections


### Channels collection 

* _id:
* groupName:
* name:
* description:

### Messages Collection

* _id:
* groupName:
* channelName:
* sender:
* content:
* imageUrl:
* timestamp

### profilePictures

* _id:
* username:
* profilePicture:

## Angular Architecture
### Components
This project contains seven core components that make up the entire frontend of the project. These components are:
* `account`: This component allows users to view their account details (username and email) and upload a profile picture. It also provides two buttons: one for logging out and another for deleting their account.
* `all-group-list`: Displays all existing groups, allowing users to request to join any group they are not already part of. These requests must be approved by a group admin. This component isn’t shown to super admins as they can already see all the groups in the program in the `user-group` component.
* `channel`: This component allows users to chat with other members of the group in real time through the use of sockets. The user can send messages via both text and images. When a message is sent in the chat box, the profile picture of the user is displayed next to the message as well as the time the message was sent. Super admins also have a delete button next to each message they can use to remove a message.
* `inbox`: This component is visible only to group admins and super admins. Group admins can use it to view and manage pending group requests. Super admins have access to two additional tabs: one for report requests, where they can see users who have been reported in channels, and another for promotion requests, where they can manage requests to promote users to group admins.
* `login`: Enables users to log in by entering their credentials, which are checked against the data stored in the `user.json` file.
* `register`: Allows users to create an account by entering a unique username, email, and password.
* `user-group`: This screen is displayed after a user logs in. It shows the groups that the user has joined. Group admins have additional options to create and delete groups and channels, but they can only modify groups they have created. Super admins have the same abilities but can modify any group without needing to be the creator.

### Services
Within this project, five services were created to manage data and provide methods for performing various actions on that data. These services are:
* `channels.service.ts`:
* `groups.service.ts`:
* `requests.service.ts`: 
* `sockets.service.ts`: 
* `users.service.ts`: 

### Models
* channel.component.ts
  * `message`:
    *  _id:
    *  groupName:
    *  name:
    *  description:
  * `GroupUser`:
    * userId:
    * username:
    * profilePicture:
* channel.services.ts
  * `Channel`:
    *  name:
    *  description:
* groups.services.ts
  * `Admin`:
    * userId:
    * username:
    * role:
    * profilePicture:
  * `Group`:
    * name:
    * admins:
    * creatorId:

## REST API, Node Server Architecture and Server Side Routes

## How data was changed and how the angular components were updated
To effectively manage and update the data within the application, I developed specific methods within the relevant services. These methods were responsible for modifying the stored data, ensuring that any changes were reflected throughout the application.

Whenever a user action required data modification—such as updating user roles, adding a new group, or processing a request—these methods would first perform the necessary changes to the data stored in local storage. After updating the data, the methods would then trigger a refresh of the Angular components that display this data. This ensured that the user interface remained consistent with the current state of the data.
