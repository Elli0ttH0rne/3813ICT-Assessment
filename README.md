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


## Angular Architecture


## REST API, Node Server Architecture and Server Side Routes
Unfortunetly my solution doesn't utilise the REST API, Node Server or any Server Side Routes. My solution has it's data stored inside the browsers local storage on launch and utilisies services to modify and retrieve the data. I realised too late that the solution required these components and was unable to make any major modifications in the remaining time.

## How data was changed and how the angular components were updated
