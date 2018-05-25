class A{
	constructor(){
		console.log("A constructor");
	}
}
class B extends A{
	constructor(){
		super(...arguments);
		console.log("B constructor");
	}
}

window.B = new B();