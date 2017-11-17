import React from "react";
import "./InfoTile.css";
import {Col} from "react-materialize";


const InfoTile = props =>

  <div data-activates={'my-side-nav'} className="infotile-frame">
    Title: {props.info.name}<br/>
    Description: {props.info.description}<br/>
    Location: {props.info.location}<br/>
  </div>

export default InfoTile;