import React, { Component } from 'react';
import "./PopFriendSpace.css";
// import noFriends from "../../assets/img/noFriends.png";
import {Modal, Button} from "react-materialize";
import Friendslist from "../Friendslist";
import PopFriendProfileDash from "../PopFriendProfileDash";
import {Collapsible, CollapsibleItem} from "react-materialize";



class PopFriendSpace extends Component {
  conditional = props => {
    let friends = this.props.friends.map((element, i) => {
            return <CollapsibleItem
              header={element.name}
              key={"fc" + element._id + i}>
              <PopFriendProfileDash friendId={element._id} onClick={() => this.gameCompare()} level={element.level} cardSrc={element.cardGraphic} cardNum={element.cardNum} />
            </CollapsibleItem>
          })
    if (this.props.friends.length > 0){
      return friends;
    }
  }

  gameCompare(e) {
    console.log("gameCompare");
  }

  render = (props) =>
  <Collapsible className="pop-friend-profile">
        {this.conditional()}
        <Modal
	        header="Friends"
	        trigger={<Button className="addFriendButtonDash">Add Friend</Button>}
	        >
	        	<Friendslist uID={this.props.uID}/>
					</Modal>
  </Collapsible>
}

export default PopFriendSpace;
