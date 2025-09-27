import React, { Component } from 'react'
import './Dashboard.css'
import { callApi , getSession, setSession } from './api';
import MenuBar from './MenuBar';
import JobPostings from './JobPostings';
import JobSearch from './JobSearch';
import MyProfile from './MyProfile';
import JobAlerts from './JobAlerts';
import CompanyProfiles from './CompanyProfiles';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      activeComponent: '',
      menuItems: [
        { mid: '1', menu: 'Job Postings', icon: '/jobs.png' },
        { mid: '2', menu: 'Job Search', icon: '/search.png' },
        { mid: '3', menu: 'My Profile', icon: '/profile.png' },
        { mid: '4', menu: 'Job Alerts', icon: '/alerts.png' },
        { mid: '5', menu: 'Companies', icon: '/company.png' }
      ]
    };
    this.showFullname = this.showFullname.bind(this);
    this.loadComponent = this.loadComponent.bind(this);
  }

  componentDidMount() {
    let csr = getSession("csrid");
    if(csr === "")
      this.logout();

    let data = JSON.stringify({csrid: csr});
    callApi("POST", "http://localhost:8070/users/getfullname", data, this.showFullname);
    
    // Load default component
    this.loadComponent('1');
  }

  showFullname(response) {
    this.setState({fullname: response});
  }

  logout() {
    setSession("csrid", "", -1);
    window.location.replace("/");
  }

  loadComponent(mid) {
    let components = {
      "1": <JobPostings />,
      "2": <JobSearch />,
      "3": <MyProfile />,
      "4": <JobAlerts />,
      "5": <CompanyProfiles />
    };
    this.setState({activeComponent: components[mid]});
  }

  render() {
    const { fullname, activeComponent, menuItems } = this.state;
    return (
      <div className='dashboard'>
        <div className='header'>
          <img className='logo' src='/logo.png' alt='' />
          <div className='logoText'>Job <span>Portal</span></div>
          <img className='logout' onClick={() => this.logout()} src='/logout.png' alt='' />
          <label>{fullname}</label>
        </div>
        <div className='menu'>
          <MenuBar 
            onMenuClick={this.loadComponent} 
            menuItems={menuItems}
          />
        </div>
        <div className='outlet'>{activeComponent}</div>
      </div>
    );
  }
}

export default Dashboard;