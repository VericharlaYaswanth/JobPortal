import React, { Component } from 'react';
import { BASEURL, callApi, getSession } from './api';
import './ResumeUpload.css';

class ResumeUpload extends Component {
  constructor() {
    super();
    this.state = {
      resumeFile: null,
      resumeUrl: '',
      uploadProgress: 0
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.uploadResume = this.uploadResume.bind(this);
  }

  componentDidMount() {
    const userId = getSession("csrid");
    callApi("GET", BASEURL + `users/resume/${userId}`, "", (response) => {
      if (!response.includes("404::")) {
        this.setState({ resumeUrl: JSON.parse(response).resumeUrl });
      }
    });
  }

  handleFileChange(e) {
    this.setState({ resumeFile: e.target.files[0] });
  }

  uploadResume() {
    const { resumeFile } = this.state;
    const userId = getSession("csrid");
    
    if (!resumeFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("userId", userId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", BASEURL + "users/upload-resume", true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        this.setState({ uploadProgress: progress });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        this.setState({ 
          resumeUrl: response.resumeUrl,
          uploadProgress: 0
        });
        alert("Resume uploaded successfully!");
      } else {
        alert("Upload failed");
      }
    };

    xhr.send(formData);
  }

  render() {
    const { resumeUrl, uploadProgress } = this.state;
    
    return (
      <div className="resume-upload-container">
        <h3>Resume Management</h3>
        
        {resumeUrl ? (
          <div className="resume-view">
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              View Current Resume
            </a>
            <button onClick={() => this.setState({ resumeUrl: '' })}>
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
    );
  }
}

export default ResumeUpload;