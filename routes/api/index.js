const router = require("express").Router();
const Article = require("../../models/Articles.js");
const Game = require("../../models/Games.js");
const User = require("../../models/Users.js");
const Group = require("../../models/Groups.js");
const request = require("request");
const cheerio = require("cheerio");
const Nightmare = require("nightmare");
const mongoose = require("mongoose").set('debug', true);
const axios = require("axios");
var parseString = require('xml2js').parseString;
const levelHelper = require("../helper/levelHelper.js")
const socketHelper = require("../../server.js");

// <<<<-------------/api/news------------>>>>
	// Searches top link from r/boardgames (Newsfeed.js)
	router.get("/news/scrape", (req, res) => {
		request("https://www.reddit.com/r/boardgames/top/?sort=top&t=day", function(error, response, html) {
			let blacklist = ["self.boardgames", "youtube.com", "youtu.be"];
			let $ = cheerio.load(html);
			$("p.title").each(function(i, element) {
				if (!blacklist.includes($(element).children("span").children("a").text())){
					let article = new Article({
						title: $(element).children("a").text(),
						link: $(element).children("a").attr("data-href-url"),
					})
					Article.findOne({title: article.title}, function(error, result){
						if (!result){
							article.save();
						}
					})
				}

			})
			setTimeout(function(){
				Article.find().sort({date: -1}).exec(function(error, result){
				res.json(result.slice(0,10))
			}), 1000
			})
		})
	})

// <<<<-------------/api/games------------>>>>
	// For using BGG API to get boardgame info, currently returns the top game info for a given search (Not Currently Used)
	// router.get("/games/:name", function(req, res){
	// 	axios.get("https://www.boardgamegeek.com/xmlapi/search?search=" + req.params.name)
	// 	.then(function(response){
	// 		parseString(response.data, function (err, result) {
	// 			let id = result.boardgames.boardgame[0]["$"]["objectid"];
	// 			axios.get("https://boardgamegeek.com/xmlapi/boardgame/" + id)
	// 			.then(function(response1){
	// 				parseString(response1.data, function (err, result1) {
	// 					res.json(result1);
	// 				})
	// 		  })
	// 		});
	// 	})
	// })

	//Gets 6 results back from a given word search to the BGG API. Used in the autofill input suggestions. (Gamelist.js)
	router.get("/games/search/:name", (req, res) => {
		// console.log("Searching: " + req.params.name);
		axios.get("https://www.boardgamegeek.com/xmlapi/search?search=" + req.params.name)
		.then(function(response){
			parseString(response.data, function (err, result) {
				res.json(result.boardgames.boardgame.slice(0, 6))
			});
		})
	})

	//Populates users games, called on load and when new games are added. (Gamelist.js)
	router.get("/games/mylist/:uid/:owned", (req, res) => {
		// if(res  null) {
			// console.log("Getting user " + req.params.owned + ".");
			User.findOne({ _id : req.params.uid}).populate("games").populate("wishlist").exec((error, result) => {
				if(result.games != null) {
					if (req.params.owned === "wishlist") {
						// console.log(result.games);
						res.json(result.wishlist);
					} else {
						// console.log(result);
						res.json(result.games);
					}
				}
			})
		// }
	})

	// For posting a new game linked to a users account. Called from the submit button on the add game modal in Dashboard component. (Gamelist.js)
	router.post("/newgame/:gameid/:uid/:owned", (req, res) => {
		let gameID = req.params.gameid;
		let userID = req.params.uid;
		// User.findOne({ _id : userID}, (err, dupeCheck) => {
		// 	console.log("NEW DUPE CHECK");
		// 	console.log(dupeCheck);
		// })
		let ownedList = req.params.owned;
		axios.get("https://boardgamegeek.com/xmlapi/boardgame/" + gameID)
				.then(function(response1){
					parseString(response1.data, function (err, result1) {
						let newGameNames = result1.boardgames.boardgame[0].name;
						let gameTitle = "";
						newGameNames.map((gameName, i) => {
							if(!gameName.$.primary) {
								// console.log("not primary")
								return
							} else {
								// console.log("gameTitle is now set to: " + gameName._)
								gameTitle = gameName._;
							}
						})

					// Assemble the game object we will be sending to the DB.
						let game = {
							title: gameTitle,
							minPlayers: parseInt(result1.boardgames.boardgame[0].minplayers),
							maxPlayers: parseInt(result1.boardgames.boardgame[0].maxplayers),
							playtime: parseInt(result1.boardgames.boardgame[0].maxplaytime),
						}
						let gameToAdd = new Game (game)
					//Search the Game collection to see if the game exists
						Game.findOne({title: game.title}, function(error, result3){
						// If the game already exists...
							if (result3){
								var key = ownedList;
								var value = result3._id;
								let thisList = {};
								thisList[key] = value;
							//Add it to the users profile, unless it already exists.
								User.findOneAndUpdate({ _id : userID }, {$addToSet:  thisList}).exec((error, result4) => {
									// console.log("updating gamelist in User Profile")
								//Update EXP for user.
									User.findOne({ _id : userID }).exec((error, result5) => {
										let newExp = levelHelper.stripExp(result5.exp + 10, result5.toNextLevel);
										User.findOneAndUpdate({ _id : userID }, {exp: newExp, level: levelHelper.levelHelper(result5.exp, 10, result5.toNextLevel, result5.level)}, function(error, res0){
											socketHelper.updateUser(userID, "exp");
											return res.json(result4)
										})
									})
								})
							}
						// If the game doesn't exist in the database..
							else {
							//Save it to the database...
								gameToAdd.save(function(error, result2){
								// console.log(result2);
								var key = ownedList;
								var value = result2._id;
								let thisList = {};
								thisList[key] = value;
							//Save the reference to the users collection...
								User.findOneAndUpdate({ _id : userID }, {$push:  thisList}).exec((error, result) => {
									// console.log("updating gamelist in User Profile")
									// console.log(result);
								//Update EXP for the user.
									User.findOne({ _id : userID }).exec((error, result5) => {
										let newExp = levelHelper.stripExp(result5.exp + 10, result5.toNextLevel);
										User.findOneAndUpdate({ _id : userID }, {exp: newExp, level: levelHelper.levelHelper(result5.exp, 10, result5.toNextLevel, result5.level)}, function(error, res0){
											socketHelper.updateUser(userID, "exp");
											return res.json(result)
										})
									})
								})
							});
							}
						})
				})
			})
	})

	router.delete("/games/deletegame/:uid/:game/:owned", (req, res) => {
		let userID = req.params.uid;
		let game = mongoose.Types.ObjectId(req.params.game);
		let owned = req.params.owned;
		owned === "owned" ?  owned = "games" : owned = "wishlist";
		let thisList = {};
		thisList[owned] = game;
		// console.log(thisList);
		// console.log(`Deleting game ${game} from ${req.params.owned}`);
						// should be({ _id : userID}, {$pull: { owned : game}})
		User.findOneAndUpdate({ _id: userID}, {$pull: thisList}).exec((error, result) => {
			if(!error){
				res.json(result)
			} else {
				console.log(error);
			}
		})
	})

// <<<<-------------/api/user------------>>>>
	//Route for getting all users (Friendslist.js)
	router.get("/user/all/:id?", (req, res) => {
		if (!req.params.id){
			User.find({}).exec((error, result) => {
				res.json(result);
			})
		}

		else {
			User.findOne({_id: req.params.id}).exec((error, result) => {
				let friends = result.friends;
				friends.push(req.params.id);
					User.find({ _id: { $nin: friends } }).exec((errorFilter, resultFilter) => {
						res.json(resultFilter);
				})
			})
		}
	})

	// Searches DB for users (Friendslist.js)
	router.get("/user/search/:searchQuery/", (req, res) => {
		console.log(req.params.searchQuery);
		let searchQuery = req.params.searchQuery;
			User.find({ name : searchQuery }).exec((error, result) => {
				res.json(result);
			})
	})

	//Route for adding a user as a friend
	router.post("/user/addfriend/:uid/:seconduid", (req, res) => {
		let userID = req.params.uid;
		let secondUserID = req.params.seconduid
		// console.log(`We be addin friends ${userID} ${secondUserID}`);
		User.findOneAndUpdate({ _id: userID}, {$push: {friends: secondUserID} }).exec((error, result) => {
			console.log(error);
			//Updating user 1 xp
			User.findOne({ _id : userID }).exec((error, result5) => {
				let newExp = levelHelper.stripExp(result5.exp + 50, result5.toNextLevel);
				User.findOneAndUpdate({ _id : userID }, {exp: newExp, level: levelHelper.levelHelper(result5.exp, 50, result5.toNextLevel, result5.level)}, function(error, res0){
					socketHelper.updateUser(userID, "exp");
				})
			})

			socketHelper.updateUser(userID, "friends");
			User.findOneAndUpdate({ _id: secondUserID}, {$push: {friends: userID} }).exec((error, result) => {
				//Updating user 2 xp
				User.findOne({ _id : secondUserID }).exec((error, result6) => {
					let newExp = levelHelper.stripExp(result6.exp + 50, result6.toNextLevel);
					User.findOneAndUpdate({ _id : secondUserID }, {exp: newExp, level: levelHelper.levelHelper(result6.exp, 50, result6.toNextLevel, result6.level)}, function(error, res0){
						socketHelper.updateUser(secondUserID, "exp");
					})
				})
				console.log(error);
				socketHelper.updateUser(secondUserID, "friends");
				User.findOneAndUpdate({ _id: userID}, {$pull: {notifications: secondUserID}}).exec((error, result) => {
					res.json(result.notifications)
				})
			})
		})
	})

	//Route for deleting a user
	router.delete("/user/deletefriend/:uid/:userToDelete", (req, res) => {
		let userID = req.params.uid;
		let secondUserID = req.params.userToDelete
		// console.log(`Deleting user ${secondUserID}`);
		User.findOneAndUpdate({ _id: userID}, {$pull: {friends: secondUserID}}).exec((error, result) => {
			res.json(result)
		})
	})

	// //Route for getting active user's friends
		// router.get("/user/:uid/friends", (req, res) => {
		// 	// console.log("These are the users friends.");
		// 	User.findOne({ _id : req.params.uid}).populate("friends").exec((error, result) => {
		// 		// console.log(result);
		// 		// result.friends.map((friend, i) => {
		// 		// 	console.log(friend.games + " iteration: " + i);
		// 		// 	friend.games.map((game, i) => {
		// 		// 		if(result.wishlist.includes(game)){
		// 		// 			// this user has a game I want
		// 		// 		}
		// 		// 	})
		// 		// })
		// 		console.log(result);
		// 		res.json(result);
		// 	})
		// })

	//Route for adding a notification
	router.post("/user/addnotification/:uid/:seconduid", (req, res) => {
		let userID = req.params.uid;
		let secondUserID = req.params.seconduid
		console.log(`We be addin notifications ${userID} ${secondUserID}`);
		User.findOneAndUpdate({ _id: userID}, {$push: {notifications: secondUserID} }).exec((error, result) => {
			console.log(error)
			socketHelper.updateUser(userID, "notifications");
			res.json(result);
		})
	})

	//Route for seeing users notifications
	router.get("/user/:uid/notifications", (req, res) => {
		let userID = req.params.uid;
		console.log('These are users notifications')
		User.findOne({ _id: req.params.uid}).populate("notifications").exec((error, result) => {
			if (result){
				res.json(result.notifications)
			} else {
				return console.log(error)
			}
		})
	})

	//Route for getting users Lvl and XP
	router.get("/user/:uid/exp", (req, res) => {
		let userID = req.params.uid;
		User.findOne({ _id: req.params.uid}).exec((error, result) => {
			if (result){
				res.json(result)
			} else {
				return console.log(error)
			}
		})
	})

	// Route for checking user status and getting mongoUID.
	router.post("/user/:uid/:userName/:userMail", (req, res) => {
		// console.log("uid" + req.params.uid)
				let user = new User(
					{ _id : req.params.uid,
						name: req.params.userName,
						email: req.params.userMail,
						cardNum: Math.floor(Math.random() * 9),
					})
			//New Version refactored to allow for population of whatever we want in App.js
				let cardGraphic = ["goblin", "ctrice", "robo", "rat", "gnome", "archer", "undead", "naga", "medusa", "bear"];
				user.cardGraphic = `cards/${cardGraphic[user.cardNum]}Card.png`;
				console.log(user);
				User.findOne({_id:req.params.uid})
						// .populate('games')
						// .populate('wishlist')
						.populate('groups')
						.populate('friends')
						.populate('games')
						.exec((error, resultUser) => {
							if (!resultUser) {
								user.save((err, result) => {
									if(!err) {
										return res.json(result);
									} else {
										return console.log(error);
									}
								})
							} else {
								res.json(resultUser);
							}
						})
		});

	//Route comparing games between user and friends. (PopFriendSpace.js)
	router.post("/compare/:uid/:friendid", (req, res) => {
		console.log(`comparing ${req.params.uid} and ${req.params.friendid}`);
		User.find({
			$or: [
				{_id: req.params.uid},
				{_id: req.params.friendid}
			]
		})
		.lean()
		.select('games wishlist')
		.populate('games', 'title')
		.populate('wishlist', 'title')
		.exec((error, doc) => {
			if(!error) {
				if (doc[0]._id === req.params.uid) {
					var myData = doc[0]
					var friendData = doc[1]
					var myIndex = 0
					var otherIndex = 1
				} else {
					var myData = doc[1]
					var friendData = doc[0]
					var myIndex = 1
					var otherIndex = 0
				}
				let gamesIHaveTheyDont = [];
				let gamesTheyHaveIDont = [];
				for(i = 0; i < friendData.games.length; i++) {
					if (!myData.games.includes(friendData.games[i])) {
						gamesTheyHaveIDont.push(friendData.games[i]);
					}
				}
				for(j = 0; j < myData.games.length; j++) {
					if(!friendData.games.includes(myData.games[j])) {
						gamesIHaveTheyDont.push(myData.games[j])
					}
				}
				// console.log(`gamesIHaveTheyWant: ${gamesIHaveTheyWant} and gamesTheyHaveIWant: ${gamesTheyHaveIWant}`);
				// doc[0].gamesIHaveTheyWant = gamesIHaveTheyWant;
				// doc[0].gamesTheyHaveIWant = gamesTheyHaveIWant;
				doc.push(gamesIHaveTheyDont, gamesTheyHaveIDont)
				res.send(doc);
			} else {
				return console.log(error);
			}
		})
	})

// <<<<-------------/api/groups------------>>>>
	//Route for creating and joining a new group (Groupsace.js)
	router.post("/groups/newgroup", (req, res) => {
		console.log(req.body);
		//Query the DB to see if group exists.
		Group.findOne({name: req.body.groupName}).exec((error, groupCheck) => {
			if(!error) {
				//If no error check to see if group exists
				if(!groupCheck){
					//if group doesn't exist, create it
						let conditions = {name: req.body.groupName};
						let update = {
								$set:	{name: req.body.groupName,
									description: req.body.groupDesc,
									location: req.body.groupLoc,
									creator: req.body.creatorID,
									games: req.body.groupGames},
								$push: {members: req.body.creatorID,
								}
							};
						let options = {upsert: true, new: true};
						Group.findOneAndUpdate(conditions, update, options, (err, responseGroup) => {
							console.log(responseGroup);
							User.findOneAndUpdate({ _id: req.body.creatorID }, {$push: {groups: responseGroup._id}})
								.exec(response => res.json(responseGroup))
								.catch(error => console.log(error))
						})
				} else {
					//if group does exist, return warning:
					return console.log("group name is already in use!");
				}
			} else {
				// If there is an error:
				return console.log(error);
			}
		})
	})

	//Route for joining a group and comparing games
	router.post("/groups/joingroup", (req, res) => {
		console.log(req.body);
	})

module.exports = router;
