// jshint esversion:6

// module.exports = {
// 	getDate: getDate,
// 	getDay: getDay
// };
exports.getDate = function () {
	const today = new Date();
	const options = {
		weekday: "long",
		day: "numeric",
		month: "long"
	};
	return today.toLocaleDateString("IN-en", options);
};

module.exports.getDay = function () {
	const today = new Date();
	const options = {
		weekday: "long"
	};
	return today.toLocaleDateString("IN-en", options);
};