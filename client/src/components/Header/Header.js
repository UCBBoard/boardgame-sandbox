import React, { Component  } from 'react';
import {Navbar, NavItem, Icon} from "react-materialize";
import "./Header.css";
import Axios from "axios";
import logo from "../../assets/img/logo.png"
import LevelBar from "../LevelBar";

class Header extends Component {
	state = {
		news: []
	}

	render () {
		return (
		<Navbar>
			<LevelBar exp={this.props.exp} toNextLevel={this.props.toNextLevel}/>
			<div className="headerLogo">
				<img src={logo} className="siteLogoHeader" alt="logo" /><h1 className="logoH1Header">GameVault</h1>
			</div>
			<Icon small>settings</Icon>
		</Navbar>
		)
	}
}

export default Header;