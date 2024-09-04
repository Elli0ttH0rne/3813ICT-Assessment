import { Injectable } from '@angular/core';
import { UsersService } from '../users/users.service';


@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private defaultGroupJoinRequests = [];
  private defaultReportRequests = [];
  private promotionRequests = [];

  constructor(
    private usersService: UsersService,
  ) { 
    this.initializeRequests();

  }

  private initializeRequests() {
    console.log('Initializing requests...');
    const groupJoinRequests = localStorage.getItem('groupJoinRequests');
    if (!groupJoinRequests) {
      localStorage.setItem('groupJoinRequests', JSON.stringify(this.defaultGroupJoinRequests));
    }
    const reportRequests = localStorage.getItem('reportRequests');
    if (!reportRequests) {
      localStorage.setItem('reportRequests', JSON.stringify(this.defaultReportRequests));
    }
    const promotionRequests = localStorage.getItem('promotionRequests');
    if (!promotionRequests) {
      localStorage.setItem('promotionRequests', JSON.stringify(this.promotionRequests));
    }
  }
  


  //******************************Join Group Request Methods******************************
  saveGroupJoinRequests(requests: any[]) {
    localStorage.setItem('groupJoinRequests', JSON.stringify(requests));
  }

  requestToJoinGroup(username: string, groupName: string): boolean {
    const requests = this.getGroupJoinRequests();
    if (requests.some(req => req.groupName === groupName)) {
      console.warn('Request already exists.');
      return false;
    }

    requests.push({ username, groupName, status: 'pending' });
    this.saveGroupJoinRequests(requests);
    return true;
  }

  getGroupJoinRequests() {
    return JSON.parse(localStorage.getItem('groupJoinRequests') || '[]');
  }

  approveJoinRequest(username: string, groupName: string): boolean {
    // Retrieve the join requests from local storage
    const requests = this.getGroupJoinRequests();
    
    // Find the index of the request to be approved
    const requestIndex = requests.findIndex(req => req.username === username && req.groupName === groupName);
  
    if (requestIndex === -1) {
      console.warn('Join request not found.');
      return false;
    }
  
    // Remove the approved request from the list
    requests.splice(requestIndex, 1);
    this.saveGroupJoinRequests(requests); // Save the updated requests back to local storage
  
    // Add the user to the group
    const users = this.usersService.getValidUsers();
    const user = users.find(u => u.username === username);
    
    if (user) {
      // Add the group to the user's group list if they aren't already a member
      if (!user.groups.includes(groupName)) {
        user.groups.push(groupName);
        this.usersService.saveValidUsers(users);
        console.log(`User ${user.username} added to group ${groupName}`);
      } else {
        console.warn(`User ${user.username} is already a member of group ${groupName}`);
      }
    } else {
      console.error(`User with ${username} not found`);
      return false;
    }
  
    return true;
  }

  rejectJoinRequest(username: string, groupName: string): boolean {
    const requests = this.getGroupJoinRequests();
    const requestIndex = requests.findIndex(req => req.username === username && req.groupName === groupName);
  
    if (requestIndex === -1) {
      console.warn('Join request not found.');
      return false;
    }
  
    // Reject the join request
    requests.splice(requestIndex, 1);
    this.saveGroupJoinRequests(requests);
  
    return true;
  }


  //******************************Reported User Methods******************************
  createReportRequest(reporterUsername: string, reportedUsername: string, reason: string, groupName: string): boolean {
    const requests = this.getReportRequests();
    requests.push({  
      reporterUsername, 
      reportedUsername, 
      reason, 
      groupName,
      status: 'pending' 
    });
    this.saveReportRequests(requests);
    return true;
  }

  resolveReportRequest(reporterId: string, reportedUserId: string): boolean {
    const requests = this.getReportRequests();
    const requestIndex = requests.findIndex(req => req.reporterId === reporterId && req.reportedUserId === reportedUserId);

    if (requestIndex === -1) {
      console.warn('Report request not found.');
      return false;
    }

    requests[requestIndex].status = 'resolved';
    this.saveReportRequests(requests);
    return true;
  }

  saveReportRequests(requests: any[]) {
    localStorage.setItem('reportRequests', JSON.stringify(requests));
  }

  getReportRequests() {
    return JSON.parse(localStorage.getItem('reportRequests') || '[]');
  }

  //******************************Group Admin Promotion Requests Methods******************************
  createPromotionRequest(requestedAdmin: string, promotionUser: string): boolean {
    const requests = this.getPromotionRequests();
    console.log('Before adding request:', requests);
    requests.push({  
      requestedAdmin, 
      promotionUser, 
      status: 'pending' 
    });
    this.savePromotionRequests(requests);
    console.log('After adding request:', this.getPromotionRequests());
    return true;
  }
  
  resolvePromotionRequest(requestedAdmin: string, promotionUser: string): boolean {
    const requests = this.getPromotionRequests();
    const requestIndex = requests.findIndex(req => req.requestedAdmin === requestedAdmin && req.promotionUser === promotionUser);
  
    if (requestIndex === -1) {
      return false;
    }
  
    requests[requestIndex].status = 'resolved';
    this.savePromotionRequests(requests);
    return true;
  }
  
 
  savePromotionRequests(requests: any[]) {
    localStorage.setItem('promotionRequests', JSON.stringify(requests));
  }

  getPromotionRequests() {
    const requests = JSON.parse(localStorage.getItem('promotionRequests') || '[]');
    return requests;
  }
  

  //******************************Pending Requests******************************
  removePendingRequests(username: string): boolean {
    // Retrieve the current list of group join requests
    const requests = this.getGroupJoinRequests();

    // Filter out requests made by the specified username
    const updatedRequests = requests.filter(req => req.username !== username);

    // Save the updated list of requests back to local storage
    this.saveGroupJoinRequests(updatedRequests);

    console.log(`Removed pending requests for username: ${username}`);
    return true;
  }

  removePendingRequestsByGroup(groupName: string): boolean {
    // Retrieve the current list of group join requests
    const requests = this.getGroupJoinRequests();

    // Filter out requests made for the specified group
    const updatedRequests = requests.filter(req => req.groupName !== groupName);

    // Save the updated list of requests back to local storage
    this.saveGroupJoinRequests(updatedRequests);

    console.log(`Removed pending requests for group: ${groupName}`);
    return true;
  }
  

  //******************************UI Methods******************************
  getRequestCount(currentUsername: string): number {
    // Retrieve the user's role from UsersService or other source
    const users = this.usersService.getValidUsers();
    const currentUser = users.find(user => user.username === currentUsername);
  
    const isGroupAdmin = currentUser.roles.includes('groupAdmin') 
    const isSuperAdmin = currentUser.roles.includes('superAdmin');
  
    if (isGroupAdmin && !isSuperAdmin) {
      return this.getGroupJoinRequests().length;
    } 
    
    if(isSuperAdmin) {
      return this.getGroupJoinRequests().length + this.getReportRequests().length + this.getPromotionRequests().length;
    }

    return 0;
  }
  
}
