import React, { Component } from 'react';
// import Bricks
import Bricks from 'bricks.js'




class BricksTest extends Component {

componentDidMount(){
	const sizes = [
  { columns: 2, gutter: 10 },
  { mq: '768px', columns: 3, gutter: 25 },
  { mq: '1024px', columns: 4, gutter: 50 }
]
	// create an instance
const instance = Bricks({
  container: ".gridTest",
  packed: 'packed',
  sizes: sizes,
  position: false
})
instance.pack()
}
render(){
	return(
		<div className="gridTest">
			<img src="https://target.scene7.com/is/image/Target/52117861?wid=520&hei=520&fmt=pjpeg" width="200px" height="200px"/>
			<img src="https://target.scene7.com/is/image/Target/52117861?wid=520&hei=520&fmt=pjpeg" width="200px" height="300px"/>
			<img src="https://target.scene7.com/is/image/Target/52117861?wid=520&hei=520&fmt=pjpeg" width="200px" height="50px"/>
			<img src="https://target.scene7.com/is/image/Target/52117861?wid=520&hei=520&fmt=pjpeg" width="200px" height="400px"/>
		</div>
	)
	}
}
export default BricksTest;
