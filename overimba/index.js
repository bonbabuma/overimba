function Person(first, last, age, gender, interests) {

	// property and method definitions
	this.name = {};
	this.name.first = first;
	this.name.last = last;
	this.age = age;
	this.gender = gender;
	this.interests = interests;
	
	/*function toString() {
		this.name.first + ' has left the building. Bye for now!';
	}*/
}

/*
function Teacher(first, last, age, gender, interests, subjects){
	Person.call(this, first, last, age, gender, interests);
	
	this.subjects = subjects;
}
*/

Person.prototype.toString = function() {
	return (this.name.first + ' has left the building. Bye for now!');
};


//var teacher1 = new Teacher('Tammi', 'Smith', 32, 'neutral', ['music', 'skiing', 'kickboxing'], ['maths','sciences','flooring']);
var person2 = new Person('Logan', 'Paul', 26, 'apachi helicopter', ['forests', 'japan', 'dabbing h8ers', 'rappin dawg']);


/*
Teacher.prototype.toString = function dts() {
	return (this.name.first + ' has left the building, favorite subject was ' + this.subjects[0]);
};
*/

//console.log(teacher1);
console.log(person2);
/*
person2.toString = function() {
	return (this.name.first + ' has left the forest. Bye youtube!');
};
*/



////console.log(person1);
//console.log(person2);
//console.log(teacher1);