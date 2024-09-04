# 3813ICT Assessment Phase 1

## Git Repository Structure

### Repository Organization

<div style="border: 1px solid #000; padding: 10px; margin: 10px;">
  The repository contains all necessary files to run the project, excluding node modules. Within the `src` folder, there is a crucial file named `main.ts` located in the `app` directory. This file handles the routing and paths of the project. The `app` folder also includes two key subdirectories: `components` and `services`. The `components` directory holds all Angular components required for the frontend, while the `services` directory contains files related to the backend functionality.
</div>

### Git Workflow

#### Branching Strategy

<div style="border: 1px solid #000; padding: 10px; margin: 10px;">
  To maintain a stable main version of the project, I utilized branching extensively. When implementing a new feature, I created a dedicated branch with a descriptive name. Upon completing the feature, I merged the branch back into the main branch. Direct work on the main branch was rare and only done when necessary.
</div>

#### Commit Frequency

<div style="border: 1px solid #000; padding: 10px; margin: 10px;">
  I made it a practice to commit changes to the branch I was working on whenever a feature or function was functional or nearly complete. This approach ensured that I always had an up-to-date cloud version of my current work, safeguarding against potential issues with my local version.
</div>



## Data Structures
### User Data Structure


### Group Data Structure


### Request Data Structure

## Angular Architecture


## REST API, Node Server Architecture and Server Side Routes
Unfortunetly my solution doesn't utilise the REST API, Node Server or any Server Side Routes. My solution has it's data stored inside the browsers local storage on launch and utilisies services to modify and retrieve the data. I realised too late that the solution required these components and was unable to make any major modifications in the remaining time.

## How data was changed and how the angular components were updated
