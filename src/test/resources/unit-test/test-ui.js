describe("ui", function() {
	var parentId = "myparent";
	var div = "mydiv";

	function init(config) {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		var module = jasmine.createSpyObj("config", [ "config" ]);
		if (config) {
			module.config.and.returnValue(config);
		}

		_initModule("ui-html", [ $, _bus, commons ]);
		_initModule("ui", [ $, _bus, module ]);

		_bus.send("ui-html:create", {
			div : div,
			parentDiv : parentId
		});
	}

	it("changes element display on ui-show", function() {
		init();
		$("#" + div).css("display", "none");

		expect($("#" + div).css("display")).toBe("none");
		_bus.send("ui-show", "mydiv");
		expect($("#" + div).css("display")).not.toBe("none");
	});

	it("changes element display on ui-hide", function() {
		init();

		expect($("#" + div).css("display")).not.toBe("none");
		_bus.send("ui-hide", "mydiv");
		expect($("#" + div).css("display")).toBe("none");
	});

	it("changes element display on ui-toggle", function() {
		init();

		expect($("#" + div).css("display")).not.toBe("none");
		_bus.send("ui-toggle", "mydiv");
		expect($("#" + div).css("display")).toBe("none");
	});

	it("sets html content on ui-set-content", function() {
		init();

		var content = "<p>HTML content</p>";
		expect($("#" + div).html()).toEqual("");
		_bus.send("ui-set-content", {
			div : div,
			content : content
		});
		expect($("#" + div).html()).toEqual(content);
	});

	it("sends config events on modules-loaded", function() {
		init([ {
			eventName : "ui-html:create",
			div : "anotherdiv",
			parentDiv : parentId
		}, {
			eventName : "ui-html:create",
			div : "yetanotherdiv",
			parentDiv : parentId
		} ]);

		_bus.send("modules-loaded");
		expect($("#" + parentId).children().length).toBe(3);
		expect($("#" + parentId).children("#anotherdiv").length).toBe(1);
		expect($("#" + parentId).children("#yetanotherdiv").length).toBe(1);
	});
});