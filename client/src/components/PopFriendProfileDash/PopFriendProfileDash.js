import React, { Component } from "react";
import "./PopFriendProfileDash.css";

class PopFriendProfileDash extends Component {
	determineCard = cardNum => {
		// let gameCompareList = this.props.compareList.map((element) => {
		// 	<p>{element}</p>
		// })
		// let cardFlavourText = ["Reviled by most forest dwellers that come upon them, the Goblin nonetheless has a keen propensity for survival.",
		// "That's no chicken...",
		// '"Does not compute."',
		// "The plague rat has been known to bring even the mightiest of civilizations to its knees through the spread of pestilence. Should you see one, erradicate it at once.",
		// '"See, there is nutin quite in this world like tinkerin. Tinkerin is the best thing a gnome can do, you see."',
		// '"Take the shot, but take it true."',
		// "In the coldest corners of the land there are legends of the dead rising from their graves. Do not be alarmed, however, for such folly could not be true.",
		// "Many a sailor has met a gruesome end at the hands of the naga.",
		// '"Quick! Look awa-',
		// '"ROOOAAAR" - Bear Bearington'
		// ]
		return(
			<div data-friend-id={this.props.friendId} className="friendPCardTextDiv">
				<h5 className="friendPCardLvl">Lv.{this.props.level}</h5>
				<div className="friendPCardDescriptionDiv valign-wrapper">
				</div>
				<div className="friendCompare">
					{this.props.compareList.map((element, i) => {
						<p className="friendCompareText">{element}</p>
					})}
				</div>
				<img src={this.props.cardSrc} className="friendPCard" alt="friendcard"/>
			</div>
			)
	}

	render(){
		return this.determineCard(this.props.cardNum)
	};
}

export default PopFriendProfileDash;
