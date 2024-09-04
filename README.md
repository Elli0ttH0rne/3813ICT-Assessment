# 3813ICT Assessment Phase 1

## Git Repository Structure

### Repository Organization

  The repository contains all necessary files to run the project, excluding node modules. Within the `src` folder, there is a crucial file named `main.ts` located in the `app` directory. This file handles the routing and paths of the project. The `app` folder also includes two key subdirectories: `components` and `services`. The `components` directory holds all Angular components required for the frontend, while the `services` directory contains files related to the backend functionality.


### Git Workflow

#### Branching Strategy
To maintain a stable main version of the project, I utilized branching extensively. When implementing a new feature, I created a dedicated branch with a descriptive name. Upon completing the feature, I merged the branch back into the main branch. Direct work on the main branch was rare and only done when necessary.


#### Commit Frequency
I made it a practice to commit changes to the branch I was working on whenever a feature or function was functional or nearly complete. This approach ensured that I always had an up-to-date cloud version of my current work, safeguarding against potential issues with my local version.


## Data Structures
### User Data Structure
The default user values were stored inside the `user.service.ts` file. defaultUsers is an array of objects containing the information of all the users that are loaded into the browsers local storage when the program starts. Inside each objects are 6 values:
* userId - a number number that can be used to identify each user (e.g u001)
* username - a unique username chosen by the user
* password - a password chosen by the user that can be used to log into their account
* email - the email entered when the user created their account
* roles - an array that stores the roles of the user (the 3 roles used are user, groupAdmin and superAdmin)
* groups - an array used to store the different names of the groups the user is apart of.

### Group Data Structure
The default groups were stored inside the `groups.service.ts` file. defaultGroups is an array of objects containing the information of all the groups that is loaded into the browsers local storage when the program starts. Inside each objects are 3 values:
* name - the name of the group
* channels - an array of the different channels inside the group (channels contain 2 values, the name of the channels and the description of the channel)
* admins - an array containing the information for each admin of the group. The array contains 3 values, userId, username and role (either creator or admin)

### Request Data Structure


## Angular Architecture


## REST API, Node Server Architecture and Server Side Routes
Unfortunetly my solution doesn't utilise the REST API, Node Server or any Server Side Routes. My solution has it's data stored inside the browsers local storage on launch and utilisies services to modify and retrieve the data. I realised too late that the solution required these components and was unable to make any major modifications in the remaining time.

## How data was changed and how the angular components were updated
