function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.foods), 1);
  });
};

it("can fetch foods", async () => {
  const me = new Person("Robert", ["tacos", "bugers"]);
  const foods = await me.fetchFavFoods();
  expect(foods).toContain("tacos");
});
