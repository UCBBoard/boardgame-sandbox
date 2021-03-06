import React, { Component } from "react";
import Axios from "axios";
import "./GroupSpace.css";
import XScrollGallery from "../XScrollGallery";
import {Button, Modal, Input} from "react-materialize";

class GroupSpace extends Component {

  state = {
    groupName : "",
    groupDesc: "",
    groupLoc: "",
    groups: []
  }

  componentDidMount () {
    this.setState({groups: this.props.groups})
  }

  addAndJoinGroup = (event) => {
    event.preventDefault();
    let uID = this.props.uID;
    Axios.post("/api/groups/newgroup", {
      creatorID: uID,
      groupName: this.state.groupName,
      groupDesc: this.state.groupDesc,
      groupLoc: this.state.groupLoc,
      groupGames: this.props.games
    }).then(response => {
      // console.log("new group data (updated)")
      // console.log(response.data);
      this.setState({
        groups: [...this.state.groups, response.data]
      })
    }).catch(error => {
      console.log(error);
    })
    document.getElementById("new-group-modal").remove();
    document.querySelector(".modal-overlay").remove();
    document.getElementsByTagName('body')[0].style.overflow = 'scroll';
  }

  onInputChange = (e) => {
    let key = e.target.id;
    let val = e.target.value;
    let obj = {};
    obj[key] = val;
    this.setState(obj);
  }

  render (props) {
    return (
      <div className="col s12 center grouplistBox">
        <div className="groupspaceHeader">
          <h2 className="grouplistHeader">Groups</h2>
          <XScrollGallery groups={this.state.groups}/>

          <Modal
            header="Create a group"
            id="new-group-modal"
            actions=" "
            trigger={<Button className='blue' id="new-group-btn" waves='light'>Create a new group</Button>}>
            <form>
              <Input s={10} placeholder="Group Name" id="groupName" name="ng-name" onChange={this.onInputChange}/>
              <Input s={10} placeholder="Description" id="groupDesc" name="ng-descrip" onChange={this.onInputChange}/>
              <Input s={10} placeholder="Location" id="groupLoc" name="ng-loc" onChange={this.onInputChange}/>
              <Input type="submit" onClick={this.addAndJoinGroup}/>
            </form>
          </Modal>

        </div>

      </div>
    )
  }
}

export default GroupSpace;