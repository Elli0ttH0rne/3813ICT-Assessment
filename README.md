# 3813ICT Assessment Phase 1

## Git Repository Structure

### Repository Organization

The repository includes all essential files for running the project, excluding node modules. Within the `src` folder, the `app` directory houses a critical file named `main.ts`, responsible for managing the project's routing and paths. The `app` folder also contains two key subdirectories: `components` and `services`. The `components` directory stores all Angular components required for the frontend, while the `services` directory contains files that handle backend functionality.


### Git Workflow

#### Branching Strategy
To ensure a stable main version of the project, I employed branching extensively. For each new feature, I created a dedicated branch with a descriptive name. Once the feature was completed, I merged the branch back into the main branch. Direct modifications to the main branch were infrequent and only done when absolutely necessary.


#### Commit Frequency
I committed changes to the branch I was working on whenever a feature or function was functional or nearing completion. This practice guaranteed that my cloud version was always up-to-date, providing a safeguard against potential issues with my local version.

## Data Structures
### User Data Structure
User data was managed within the `user.service.ts` file. The `defaultUsers` array contains objects representing all users, which are loaded into the browser's local storage when the application starts. Each object includes the following six attributes:
* `userId`: A unique identifier for each user (e.g., u001).
* `username`: A unique username selected by the user.
* `password`: A password chosen by the user for account login.
* `email`: The email address provided during account creation.
* `roles`: An array that stores the user's roles (e.g., user, groupAdmin, superAdmin).
* `groups`: An array listing the names of the groups the user belongs to.

### Group Data Structure
Group data is managed within the `groups.service.ts` file. The `defaultGroups` array contains objects representing all groups, which are loaded into the browser's local storage upon application start. Each object includes the following three attributes:
* `name`: The name of the group.
* `channels`: An array of channels within the group, with each channel including its name and description.
* `admins`: An array of objects containing information about each group admin, including `userId`, `username`, and `role` (either creator or admin).

### Request Data Structure
Request data is managed within the `requests.service.ts` file. Initially, three empty arrays are established to handle different types of requests in the project:
* `defaultGroupRequests`: Stores requests from users who wish to join a group they are not yet part of.
* `defaultReportRequests`: Stores requests generated when a user reports another user.
* `promotionRequests`: Stores requests created by group admins when they want to promote a user to group admin.


## Angular Architecture
### Components
The solution currently includes seven components that make up the entire frontend of the project. These components are:

* `account`: This component allows users to view their username and email. It also provides two buttons: one for logging out and another for deleting their account.

* `all-group-list`: Displays all existing groups, allowing users to request to join any group they are not already part of. These requests must be approved by a group admin.

* `channel`: Displays the details of the selected channel within a group.

* `inbox`: This component is visible only to group admins and super admins. Group admins can use it to view and manage pending group requests. Super admins have access to additional tabs: one for report requests, where they can see users who have been reported, and another for promotion requests, where they can manage requests to promote users to group admins.

* `login`: Enables users to log in by entering their credentials, which are checked against the data stored in local storage to verify their validity.

* `register`: Allows users to create an account by entering a unique username, email, and password.

* `user-group`: This screen is displayed after a user logs in. It shows the groups that the user has joined. Group admins have additional options to create and delete groups and channels, but they can only modify groups they have created. Super admins have the same abilities but can modify any group without needing to be the creator.

### Services
Within this project, four services were created to manage data and provide methods for performing various actions on that data. These services are:

* `auth.service.ts`: This service contains functions used to promote users to group admin or super admin roles.

* `groups.service.ts`: This service manages the data for all default groups and provides the necessary methods to support the functionality of the solution.

* `requests.service`.ts: This service holds the arrays for different types of requests, such as group join requests, report requests, and promotion requests. It also includes methods for creating, approving, rejecting, and deleting these requests.

* `users.service.ts`: This service handles methods related to retrieving user information, as well as creating and deleting users.

## REST API, Node Server Architecture and Server Side Routes
Unfortunetly my solution doesn't utilise the REST API, Node Server or any Server Side Routes. My solution has it's data stored inside the browsers local storage on launch and utilisies services to modify and retrieve the data. I realised too late that the solution required these components and was unable to make any major modifications in the remaining time.

## How data was changed and how the angular components were updated
To effectively manage and update the data within the application, I developed specific methods within the relevant services. These methods were responsible for modifying the stored data, ensuring that any changes were reflected throughout the application.

Whenever a user action required data modification—such as updating user roles, adding a new group, or processing a request—these methods would first perform the necessary changes to the data stored in local storage. After updating the data, the methods would then trigger a refresh of the Angular components that display this data. This ensured that the user interface remained consistent with the current state of the data.
