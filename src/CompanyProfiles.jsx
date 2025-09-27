import React, { Component } from 'react';
import { BASEURL, callApi } from './api';
import './CompanyProfiles.css';

class CompanyProfiles extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      selectedCompany: null,
      searchTerm: ''
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.viewCompany = this.viewCompany.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    callApi("GET", BASEURL + "companies", "", (response) => {
      if (!response.includes("404::")) {
        this.setState({ companies: JSON.parse(response) });
      }
    });
  }

  handleSearch(e) {
    this.setState({ searchTerm: e.target.value });
  }

  viewCompany(company) {
    callApi("GET", BASEURL + `companies/${company.id}`, "", (response) => {
      if (!response.includes("404::")) {
        this.setState({ selectedCompany: JSON.parse(response) });
      }
    });
  }

  closeModal() {
    this.setState({ selectedCompany: null });
  }

  render() {
    const { companies, selectedCompany, searchTerm } = this.state;
    const filteredCompanies = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <div className="company-profiles-container">
        <div className="search-header">
          <h2>Companies</h2>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={this.handleSearch}
          />
        </div>
        
        <div className="companies-grid">
          {filteredCompanies.map(company => (
            <div key={company.id} className="company-card" onClick={() => this.viewCompany(company)}>
              <div className="company-logo">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} />
                ) : (
                  <div className="logo-placeholder">{company.name.charAt(0)}</div>
                )}
              </div>
              <div className="company-info">
                <h3>{company.name}</h3>
                <p>{company.industry}</p>
                <div className="rating">
                  {'★'.repeat(Math.round(company.rating))}
                  {'☆'.repeat(5 - Math.round(company.rating))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedCompany && (
          <div className="company-modal" onClick={this.closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <span className="close-btn" onClick={this.closeModal}>&times;</span>
              
              <div className="modal-header">
                {selectedCompany.logoUrl && (
                  <img src={selectedCompany.logoUrl} alt={selectedCompany.name} />
                )}
                <h2>{selectedCompany.name}</h2>
                <p>{selectedCompany.industry}</p>
                <div className="company-rating">
                  Rating: {'★'.repeat(Math.round(selectedCompany.rating))}
                  {'☆'.repeat(5 - Math.round(selectedCompany.rating))}
                  ({selectedCompany.reviewCount} reviews)
                </div>
              </div>
              
              <div className="modal-body">
                <div className="company-details">
                  <h3>About Us</h3>
                  <p>{selectedCompany.description}</p>
                  
                  <h3>Company Details</h3>
                  <div className="details-grid">
                    <div>
                      <strong>Location:</strong> {selectedCompany.location}
                    </div>
                    <div>
                      <strong>Size:</strong> {selectedCompany.size}
                    </div>
                    <div>
                      <strong>Founded:</strong> {selectedCompany.founded}
                    </div>
                    <div>
                      <strong>Website:</strong> 
                      <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
                        {selectedCompany.website}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="job-openings">
                  <h3>Current Job Openings</h3>
                  {selectedCompany.jobs && selectedCompany.jobs.length > 0 ? (
                    <ul>
                      {selectedCompany.jobs.map(job => (
                        <li key={job.id}>
                          <h4>{job.title}</h4>
                          <p>{job.type} • {job.location} • ${job.salary}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No current openings</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CompanyProfiles;