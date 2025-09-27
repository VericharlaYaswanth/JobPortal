import React, { Component } from 'react';
import { BASEURL, callApi, getSession } from './api';
import './MyProfile.css';

class MyProfile extends Component {
  constructor() {
    super();
    this.state = {
      userDetails: {},
      applications: [],
      editMode: false,
      resumeFile: null,
      uploadProgress: 0
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.uploadResume = this.uploadResume.bind(this);
  }

  componentDidMount() {
    const userId = getSession("csrid");
    if(!userId) return;

    // Get user details
    callApi("GET", BASEURL + `users/details/${userId}`, "", (response) => {
      if(!response.includes("404::")) {
        this.setState({ userDetails: JSON.parse(response) });
      }
    });

    // Get user applications
    callApi("GET", BASEURL + `applications/user/${userId}`, "", (response) => {
      if(!response.includes("404::")) {
        this.setState({ applications: JSON.parse(response) });
      }
    });
  }

  handleInputChange = (e) => {
    this.setState({
      userDetails: {
        ...this.state.userDetails,
        [e.target.name]: e.target.value
      }
    });
  }

  handleFileChange = (e) => {
    this.setState({ resumeFile: e.target.files[0] });
  }

  uploadResume = () => {
    const { resumeFile } = this.state;
    const userId = getSession("csrid");
    
    if(!resumeFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("userId", userId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", BASEURL + "users/upload-resume", true);

    xhr.upload.onprogress = (e) => {
      if(e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        this.setState({ uploadProgress: progress });
      }
    };

    xhr.onload = () => {
      if(xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        this.setState({ 
          userDetails: {
            ...this.state.userDetails,
            resumeUrl: response.resumeUrl
          },
          uploadProgress: 0
        });
        alert("Resume uploaded successfully!");
      } else {
        alert("Upload failed");
      }
    };

    xhr.send(formData);
  }

  saveProfile = () => {
    const { userDetails } = this.state;
    callApi("PUT", BASEURL + "users/update", JSON.stringify(userDetails), (response) => {
      alert(response.split("::")[1]);
      this.setState({ editMode: false });
    });
  }

  render() {
    const { userDetails, applications, editMode, resumeFile, uploadProgress } = this.state;
    
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h2>My Profile</h2>
          <button onClick={() => this.setState({ editMode: !editMode })}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-details">
          {editMode ? (
            <div className="edit-form">
              <label>Full Name</label>
              <input 
                name="fullname" 
                value={userDetails.fullname || ''} 
                onChange={this.handleInputChange} 
              />
              
              <label>Email</label>
              <input 
                name="email" 
                value={userDetails.email || ''} 
                onChange={this.handleInputChange} 
              />
              
              <label>Phone</label>
              <input 
                name="phone" 
                value={userDetails.phone || ''} 
                onChange={this.handleInputChange} 
              />
              
              <button onClick={this.saveProfile}>Save Changes</button>
            </div>
          ) : (
            <div className="view-mode">
              <p><strong>Name:</strong> {userDetails.fullname}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Role:</strong> {userDetails.role === "1" ? 'Admin' : 
                                        userDetails.role === "2" ? 'Employee' : 'Job Seeker'}</p>
              <p><strong>Phone:</strong> {userDetails.phone || 'Not provided'}</p>
            </div>
          )}
        </div>

        <div className="resume-section">
          <h3>My Resume</h3>
          {userDetails.resumeUrl ? (
            <div className="resume-view">
              <a href={userDetails.resumeUrl} target="_blank" rel="noopener noreferrer">
                View Current Resume
              </a>
              <button onClick={() => this.setState({ 
                userDetails: {...userDetails, resumeUrl: ''}
              })}>
                Remove Resume
              </button>
            </div>
          ) : (
            <div className="upload-section">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={this.handleFileChange}
              />
              <button onClick={this.uploadResume}>Upload Resume</button>
              {uploadProgress > 0 && (
                <div className="progress-bar">
                  <div style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
              <p className="file-note">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          )}
        </div>

        <div className="applications-section">
          <h3>My Applications</h3>
          {applications.length > 0 ? (
            <div className="applications-list">
              {applications.map(app => (
                <div key={app.id} className="application-card">
                  <h4>{app.jobTitle}</h4>
                  <p>{app.company} - {app.location}</p>
                  <p>Applied on: {new Date(app.appliedDate).toLocaleDateString()}</p>
                  <p>Status: <span className={`status-${app.status || 'pending'}`}>
                    {app.status || 'Under review'}
                  </span></p>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't applied to any jobs yet.</p>
          )}
        </div>
      </div>
    )
  }
}

export default MyProfile;