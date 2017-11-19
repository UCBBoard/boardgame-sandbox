import React from "react";
import "./Background.css";

const Background = props =>
	<div id={"db-scroll"} className={props.backgroundName}>
		{props.children}
	</div>
export default Background;
