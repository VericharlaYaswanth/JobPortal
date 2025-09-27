import React, { Component } from 'react'
import { BASEURL, callApi, getSession } from './api';
import './JobSearch.css'

class JobSearch extends Component {
  constructor() {
    super();
    this.state = {
      jobs: [],
      searchSkill: '',
      searchLocation: '',
      filteredJobs: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.applyForJob = this.applyForJob.bind(this);
  }

  componentDidMount() {
    callApi("GET", BASEURL + "jobs/read", "", (response) => {
      if(!response.includes("404::")) {
        let data = JSON.parse(response);
        this.setState({ jobs: data, filteredJobs: data });
      }
    });
  }

  handleSearch() {
    const { jobs, searchSkill, searchLocation } = this.state;
    const filtered = jobs.filter(job => {
      const skillMatch = job.title.toLowerCase().includes(searchSkill.toLowerCase()) || 
                        job.description.toLowerCase().includes(searchSkill.toLowerCase());
      const locationMatch = job.location.toLowerCase().includes(searchLocation.toLowerCase());
      return skillMatch && locationMatch;
    });
    this.setState({ filteredJobs: filtered });
  }

  applyForJob(jobId) {
    const userId = getSession("csrid");
    if(!userId) {
      alert("Please login to apply for jobs");
      return;
    }
    
    const data = JSON.stringify({
      jobId: jobId,
      userId: userId,
      appliedDate: new Date().toISOString()
    });

    callApi("POST", BASEURL + "applications/apply", data, (response) => {
      alert(response.split("::")[1]);
    });
  }

  render() {
    const { searchSkill, searchLocation, filteredJobs } = this.state;
    
    return (
      <div className="jobsearch-container">
        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Search by skill" 
            value={searchSkill}
            onChange={(e) => this.setState({ searchSkill: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Location" 
            value={searchLocation}
            onChange={(e) => this.setState({ searchLocation: e.target.value })}
          />
          <button onClick={this.handleSearch}>Search</button>
        </div>

        <div className="job-results">
          {filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <div className="job-meta">
                <span>{job.company}</span>
                <span>{job.location}</span>
                <span>{job.salary}</span>
              </div>
              <p>{job.description.substring(0, 150)}...</p>
              <button onClick={() => this.applyForJob(job.id)}>Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default JobSearch;