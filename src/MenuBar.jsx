import React, { Component } from 'react'
import './MenuBar.css'

export default class MenuBar extends Component {
  render() {
    const { menuItems } = this.props;
    return (
      <div className='menubar'>
        <div className='menuheader'>MENU<img src='/menu.png' alt='' /></div>
        <div className='menulist'>
          <ul>
            {menuItems.map((row) => (
              <li key={row.mid} onClick={() => this.props.onMenuClick(row.mid)}>
                {row.menu} <img src={row.icon} alt=' ' />
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}