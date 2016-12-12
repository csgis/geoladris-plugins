describe("ui-dropdown-buttons", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.stopListenAll();
		spyOn(_bus, "send").and.callThrough();

		// Mock the button and sliding div events
		_bus.listen("ui-sliding-div:create", function(e, msg) {
			$("#" + parentId).append($("<div/>").attr("id", msg.div));
		});
		_bus.listen("ui-button:create", function(e, msg) {
			$("#" + parentId).append($("<div/>").attr("id", msg.div));
		});

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-dropdown-buttons", [ $, _bus, commons ]);
	});

	it("calls ui-button:create on create", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			text : "text"
		});
		expect(_bus.send).toHaveBeenCalledWith("ui-button:create", jasmine.objectContaining({
			div : "mybutton",
			parentDiv : "mybutton-container",
			css : "ui-dropdown-button-button",
			text : "text"
		}));
	});

	it("calls ui-sliding-div:create on create", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			text : "text"
		});
		expect(_bus.send).toHaveBeenCalledWith("ui-sliding-div:create", jasmine.objectContaining({
			div : "mybutton-sliding",
			parentDiv : "mybutton-container"
		}));
	});

	it("adds a div on add-item", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});

		expect($("#mybutton-sliding").children().length).toBe(0);
		_bus.send("ui-dropdown-button:mybutton:add-item", {
			id : "myitem",
			image : "theme/images/image.svg"
		});
		expect($("#mybutton-sliding").children().length).toBe(1);
		var bg = $("#mybutton-sliding").children().css("background-image");
		expect(bg.indexOf("theme/images/image.svg")).not.toBe(-1);
	});

	it("toggles the sliding on click if dropdownOnClick", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			dropdownOnClick : true
		});

		expect(_bus.send).not.toHaveBeenCalledWith("ui-sliding-div:toggle", "mybutton-sliding");
		$("#mybutton").click();
		expect(_bus.send).toHaveBeenCalledWith("ui-sliding-div:toggle", "mybutton-sliding");
	});

	it("sends item-selected on item click", function() {
		mockWithItem();
		$("#mybutton-sliding").children().click();
		expect(_bus.send).toHaveBeenCalledWith("ui-dropdown-button:mybutton:item-selected", "myitem");
	});

	it("collapses sliding div on item click", function() {
		mockWithItem();
		$("#mybutton-sliding").children().click();
		expect(_bus.send).toHaveBeenCalledWith("ui-sliding-div:collapse", "mybutton-sliding");
	});

	it("changes the button background on item click", function() {
		mockWithItem();
		$("#mybutton-sliding").children(":eq(1)").click();
		expect(_bus.send).toHaveBeenCalledWith("ui-button:mybutton:set-image", "theme/images/icon2.png");
	});

	it("changes the button background on set-item", function() {
		mockWithItem();
		_bus.send("ui-dropdown-button:mybutton:set-item", "myitem2");
		expect(_bus.send).toHaveBeenCalledWith("ui-button:mybutton:set-image", "theme/images/icon2.png");
	});

	it("sets title attribute if tooltip provided on add-item", function() {
		var tooltip = "My item tooltip";
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			dropdownOnClick : true
		});
		_bus.send("ui-dropdown-button:mybutton:add-item", {
			id : "myitem",
			image : "theme/images/icon.png",
			tooltip : tooltip
		});

		var item = $("#mybutton-sliding").children();
		expect(item.attr("title")).toBe(tooltip);
	});

	it("does not change the button background on item click if already selected", function() {
		mockWithItem();
		_bus.send("ui-dropdown-button:mybutton:set-item", "myitem");

		$("#mybutton-sliding").children(":eq(0)").click();
		expect(getNumEventCalls(_bus.send, "ui-button:mybutton:set-image")).toBe(1);
	});

	it("does not change the button background on set-item if already selected", function() {
		mockWithItem();
		_bus.send("ui-dropdown-button:mybutton:set-item", "myitem");
		expect(getNumEventCalls(_bus.send, "ui-button:mybutton:set-image")).toBe(1);
	});

	function mockWithItem() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			dropdownOnClick : true
		});
		_bus.send("ui-dropdown-button:mybutton:add-item", {
			id : "myitem",
			image : "theme/images/img.svg"
		});
		_bus.send("ui-dropdown-button:mybutton:add-item", {
			id : "myitem2",
			image : "theme/images/icon2.png"
		});
	}

	function getNumEventCalls(mock, eventName) {
		var calls = mock.calls.all();
		var n = 0;
		for (var i = 0; i < calls.length; i++) {
			if (calls[i].args[0] == eventName) {
				n++;
			}
		}
		return n;
	}
});