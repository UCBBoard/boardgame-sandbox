import React, { Component } from "react";
import "./PopFriendProfileDash.css";
import {CollapsibleItem} from "react-materialize";
// import goblin from "../../assets/cards/goblinCard.png";
// import ctrice from "../../assets/cards/ctriceCard.png";
// import robo from "../../assets/cards/roboCard.png";
// import rat from "../../assets/cards/ratCard.png";
// import gnome from "../../assets/cards/gnomeCard.png";
// import archer from "../../assets/cards/archerCard.png";
// import undead from "../../assets/cards/undeadCard.png";
// import naga from "../../assets/cards/nagaCard.png";
// import medusa from "../../assets/cards/medusaCard.png";
// import bear from "../../assets/cards/bearCard.png";
// import ReactTooltip from 'react-tooltip';


class PopFriendProfileDash extends Component {
	determineCard = cardNum => {
		// let cardGraphic = [goblin, ctrice, robo, rat, gnome, archer, undead, naga, medusa, bear];
		let cardFlavourText = ["Reviled by most forest dwellers that come upon them, the Goblin nonetheless has a keen propensity for survival.",
		"That's no chicken...",
		'"Does not compute."',
		"The plague rat has been known to bring even the mightiest of civilizations to its knees through the spread of pestilence. Should you see one, erradicate it at once.",
		'"See, there is nutin quite in this world like tinkerin. Tinkerin is the best thing a gnome can do, you see."',
		'"Take the shot, but take it true."',
		"In the coldest corners of the land there are legends of the dead rising from their graves. Do not be alarmed, however, for such folly could not be true.",
		"Many a sailor has met a gruesome end at the hands of the naga.",
		'"Quick! Look awa-',
		'"ROOOAAAR" - Bear Bearington'
		]
		return(
			<div className="friendDCardTextDiv">
				<h3 className="friendDCardUsername">{this.props.userName}</h3>
				<h5 className="friendDCardLvl">Lv.{this.props.level}</h5>
				<div className="friendDCardDescriptionDiv valign-wrapper">
					<p className="friendDCardDescription">{cardFlavourText[cardNum]}</p>
				</div>
				{/* <img src={this.props.cardSrc} className="friendDCard" alt="friendcard"/> */}
			</div>
			)
	}

	render(){
		return this.determineCard(this.props.cardNum)
	};
}

export default PopFriendProfileDash;
