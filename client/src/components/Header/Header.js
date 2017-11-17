import React, { Component  } from 'react';
import {Navbar, NavItem, Icon} from "react-materialize";
import "./Header.css";
import Axios from "axios";

class Header extends Component {
	state = {
		news: []
	}

	render () {
		return (
		<Navbar brand='logo' right>
			<NavItem href='get-started.html'>Getting started</NavItem>
		</Navbar>
		)
	}
}

export default Header;