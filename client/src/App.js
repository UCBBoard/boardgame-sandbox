import React, { Component } from "react";
import { BrowserRouter} from 'react-router-dom'
import { firebaseAuth } from './config/constants';
import Dashboard from "./components/Dashboard";
import Splash from "./components/Splash";
import LoadingScreen from "./components/LoadingScreen";
import Axios from "axios";

class App extends Component {
	state = {
		authed: false,
		loading: true,
		userName: '',
		UID: '',
		level: 1,
		exp: 1,
		toNextLevel: 100,
		cardNum: 0,
		groups: []
	}

	increaseExp = expToAdd => {
		let newExp = this.state.exp + expToAdd;
		this.setState({exp: newExp});
	}

	updateLvl = id => {
		Axios.get("api/user/" + id + "/exp").then(response => {
			this.setState({exp: response.data.exp, level: response.data.level})
		})
	}

	componentDidMount () {
		this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
			if (user) {
				let userName = user.email.split("@")[0]
				console.log(userName)
				Axios.post("/api/user/" + user.uid + "/" + userName + "/" + user.email)
						.then((response) => {
							this.setState({
							level: response.data.level,
							UID: user.uid,
							userName: userName,
							authed: true,
							loading: false,
							exp: response.data.exp,
							toNextLevel: response.data.toNextLevel,
							cardNum: response.data.cardNum,
							groups: response.data.groups,
<<<<<<< HEAD
							games: response.data.games,
							friends: response.data.friends,
							cardGraphic: response.data.cardGraphic
=======
							cardGraphic: response.data.cardGraphic,
							games: response.data.games,
							friends: response.data.friends
>>>>>>> ec9b5d96e1c69fd839ed075865848378de33a55d
							});
		    			console.log("searching database for user:");
		    			console.log(response.data);
		    		})
				// Axios.post(`/api/user/${user.uid}/${userName}`)
				// .then((response, error) => {
				// 	this.setState({
				// 		level: response.data.level,
				// 		UID: user.uid,
				// 		userName: userName,
				// 		authed: true,
				// 		loading: false,
				// 	});
				// 	console.log("searching database for user:" + response);
				// })
			} else {
				this.setState({
					authed: false,
					loading: false
				})
			}
		})
	}

	componentWillUnmount () {
		this.removeListener()
	}

	render() {
		return this.state.loading === true ? <LoadingScreen /> : (
			<BrowserRouter>
				<div>
					{this.state.authed? <Dashboard userName = {this.state.userName}
					uID = {this.state.UID}
					level = {this.state.level}
					exp = {this.state.exp}
					toNextLevel = {this.state.toNextLevel}
					cardNum = {this.state.cardNum}
					increaseExp = {this.increaseExp}
					updateLvl = {this.updateLvl}
					groups = {this.state.groups}
<<<<<<< HEAD
					games = {this.state.games}
					friends = {this.state.friends}
					cardGraphic = {this.state.cardGraphic}
=======
					cardGraphic = {this.state.cardGraphic}
					games = {this.state.games}
					friends = {this.state.friends}
>>>>>>> ec9b5d96e1c69fd839ed075865848378de33a55d
					/> : <Splash/>}
				</div>
			</BrowserRouter>
		);
	}}

	export default App;
