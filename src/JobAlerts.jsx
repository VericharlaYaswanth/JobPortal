import React, { Component } from 'react';
import { BASEURL, callApi, getSession } from './api';
import './JobAlerts.css';

class JobAlerts extends Component {
  constructor() {
    super();
    this.state = {
      alerts: [],
      searchTerm: '',
      location: '',
      frequency: 'daily',
      isActive: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleAlerts = this.toggleAlerts.bind(this);
  }

  componentDidMount() {
    const userId = getSession("csrid");
    callApi("GET", BASEURL + `alerts/user/${userId}`, "", (response) => {
      if (!response.includes("404::")) {
        const data = JSON.parse(response);
        this.setState({ 
          alerts: data.alerts,
          isActive: data.isActive 
        });
      }
    });
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  toggleAlerts() {
    const { isActive, searchTerm, location, frequency } = this.state;
    const userId = getSession("csrid");
    
    const data = JSON.stringify({
      userId,
      searchTerm,
      location,
      frequency,
      isActive: !isActive
    });

    callApi("POST", BASEURL + "alerts/toggle", data, (response) => {
      const result = JSON.parse(response);
      this.setState({ isActive: result.isActive });
      alert(result.message);
    });
  }

  render() {
    const { searchTerm, location, frequency, isActive, alerts } = this.state;
    
    return (
      <div className="job-alerts-container">
        <h3>Job Alerts</h3>
        
        <div className="alert-controls">
          <div className="form-group">
            <label>Keywords</label>
            <input 
              type="text" 
              name="searchTerm" 
              value={searchTerm}
              onChange={this.handleInputChange}
              placeholder="e.g. 'React Developer'"
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input 
              type="text" 
              name="location" 
              value={location}
              onChange={this.handleInputChange}
              placeholder="e.g. 'New York'"
            />
          </div>
          
          <div className="form-group">
            <label>Frequency</label>
            <select 
              name="frequency" 
              value={frequency}
              onChange={this.handleInputChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <button 
            onClick={this.toggleAlerts}
            className={isActive ? 'active' : ''}
          >
            {isActive ? 'Turn Off Alerts' : 'Activate Alerts'}
          </button>
        </div>
        
        {alerts.length > 0 && (
          <div className="alerts-history">
            <h4>Recent Alert Matches</h4>
            <ul>
              {alerts.map((alert, index) => (
                <li key={index}>
                  <span className="alert-date">{new Date(alert.date).toLocaleDateString()}</span>
                  <span className="alert-text">{alert.jobTitle} at {alert.company}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default JobAlerts;