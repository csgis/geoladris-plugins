define([ "geoladris-tests" ], function(tests) {
	describe("checkbox", function() {
		var bus;
		var injector;
		var module;
		var parentId = "parent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "checkbox" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("adds a checkbox", function() {
			var input = module({
				id : "myitem",
				parent : parentId,
				text : "Item 1"
			});
			input = $(input);

			expect(input.length).toBe(1);
			expect(input.attr("type")).toBe("checkbox");

			var container = $("#" + parentId).children(".ui-checkbox-container");
			expect(container.children(".ui-checkbox-input").length).toBe(1);
			expect(container.children(".ui-checkbox-text").length).toBe(1);
		});

		it("triggers input click on checkbox text clicked", function() {
			var input = module({
				id : "myitem",
				parent : parentId,
				text : "Item 1"
			});
			input = $(input);

			var clicked;
			input.click(function() {
				clicked = true;
			})

			$("#" + parentId).find(".ui-checkbox-text").click();
			expect(clicked).toBe(true);
		});
	});
});