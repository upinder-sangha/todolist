// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-upinder:Test123@cluster0-jay09.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
	name: String
});
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
	name: "brush teeth"
});
const item2 = new Item({
	name: "bath"
});
const item3 = new Item({
	name: "eat food"
});
const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
	name: String,
	items: [itemSchema]
});
const List = mongoose.model("List", listSchema);


// ------------------------------------------------------------------------------

app.get("/", function (req, res) {

	Item.find(function (err, items) {
		if (items.length == 0) {
			Item.insertMany(defaultItems, function (err) {
				if (err)
					console.log(err);
				else
					console.log("successfully added");
			});
			res.redirect("/");
		}
		else {
			res.render("list", { listTitle: "Today", listOfItems: items });
		}
	});

});

app.get("/:customListName", function (req, res) {
	const customListName = _.capitalize(req.params.customListName);
	List.findOne({ name: customListName }, function (err, foundList) {
		if (!err) {
			if (!foundList) {
				//create a new list
				const list = new List({
					name: customListName,
					items: defaultItems
				});
				list.save();
				res.redirect("/" + customListName);
			}
			else {
				// show existing list
				res.render("list", { listTitle: foundList.name, listOfItems: foundList.items });
			}
		}

	});


});


app.post("/", function (req, res) {

	const listName = req.body.listName;
	const newItem = new Item({
		name: req.body.newItem
	});

	if (listName === "Today") {
		// console.log("skdfj");
		newItem.save();
		res.redirect("/");
	}
	else {
		List.findOne({ name: listName }, function (err, foundList) {
			// console.log("found");
			foundList.items.push(newItem);
			foundList.save();
			res.redirect("/" + listName);
		});
	}


});

app.post("/delete", function (req, res) {

	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.deleteOne({ _id: checkedItemId }, function (err) {
			if (!err) {
				console.log("successfully deleted");
				res.redirect("/");
			}
		});
	}
	else {
		List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
			if (!err) {
				res.redirect("/" + listName);
			}
		});
	}

});


app.listen(3000, function () {
	console.log("server started on port 3000");
});