import React, { Component } from 'react';
import "./PopFriendSpace.css";
// import noFriends from "../../assets/img/noFriends.png";
import {Modal, Button} from "react-materialize";
import Friendslist from "../Friendslist";
import Axios from "axios";
import PopFriendProfileDash from "../PopFriendProfileDash";
import {Collapsible, CollapsibleItem} from "react-materialize";



class PopFriendSpace extends Component {
  conditional = props => {
    let friends = this.props.friends.map((element, i) => {
            return <CollapsibleItem
              header={element.name}
              id={element._id}
              key={"fc" + element._id + i}
              onClick={() => this.gameCompare(element._id, this.props.uID)}
              >
              <PopFriendProfileDash
                uid={this.props.uid} friendId={element._id}  level={element.level} cardSrc={element.cardGraphic} cardNum={element.cardNum} />
            </CollapsibleItem>
          })
    if (this.props.friends.length > 0){
      return friends;
    }
  }

  gameCompare(friendId, uId) {
    console.log("gameCompare");
    console.log(`comparing friend:${friendId} with user:${uId}`);
    Axios.post(`api/compare/${uId}/${friendId}`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
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
