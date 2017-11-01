import React from "react";
import "./XScrollGallery.css";
import InfoTile from "../InfoTile";


const XScrollGallery = props =>
  <div className="horizontal-scroll-gallery">
    {props.groups.map((group, i) => {
      return <InfoTile
        key={group._id}
        info={props.groups[i]}
      />
      })
    }
  </div>

export default XScrollGallery;
