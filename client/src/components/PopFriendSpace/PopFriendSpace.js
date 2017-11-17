import React, { Component } from 'react';
import "./PopFriendSpace.css";
// import noFriends from "../../assets/img/noFriends.png";
import {Modal, Button} from "react-materialize";
import Friendslist from "../Friendslist";
import PopFriendProfileDash from "../PopFriendProfileDash";
import {CollapsibleItem} from "react-materialize";



class PopFriendSpace extends Component {
  conditional = props => {
    let friends = this.props.friends.map((element, i) => {
            console.log(element);
            return <CollapsibleItem header={element.name} key={"fc" + element._id + i}><PopFriendProfileDash level={element.level} cardSrc={element.cardGraphic} cardNum={element.cardNum} /></CollapsibleItem>
          })
    if (this.props.friends.length > 0){
      return (
        <div>
          {friends}
        </div>
        )
    }
  }

  render = (props) =>
  <div className="col s12 center">
      <div className="noFriendsDiv">
        {this.conditional()}
        <Modal
	        header="Friends"
	        trigger={<Button className="addFriendButtonDash">Add Friend</Button>}
	        >
	        	<Friendslist uID={this.props.uID}/>
					</Modal>
	      </div>
  </div>
}

export default PopFriendSpace;
