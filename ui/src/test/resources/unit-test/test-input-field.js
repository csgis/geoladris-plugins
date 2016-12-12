describe("ui-input-field", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.stopListenAll();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-input-field", [ $, _bus, commons ]);
	});

	it("creates div on ui-input-field:create", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#myinput").length).toBe(1);
	});

	it("adds label if specified on create", function() {
		var text = "Input: ";
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId,
			label : text
		});

		var label = $("#myinput").find("label");
		expect(label.length).toBe(1);
		expect(label.text()).toEqual(text);
	});

	it("sets input type if specified on create", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId,
			type : "password"
		});

		var input = $("#myinput").find("input");
		expect(input.length).toBe(1);
		expect(input.attr("type")).toBe("password");
	});

	it("fills message on -field-value-fill", function() {
		var inputText = "Input Text";
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});
		$("#myinput").find("input").val(inputText);

		var message = {};
		_bus.send("myinput-field-value-fill", message);
		expect(message["myinput"]).toEqual(inputText);
	});

	it("sets input value and sends value-changed on set-value", function() {
		var inputText = "Input text";
		var anotherText = "Another text";

		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});
		$("#myinput").find("input").val(inputText);

		expect(_bus.send).not.toHaveBeenCalledWith("ui-input-field:myinput:value-changed", anotherText);
		_bus.send("ui-input-field:myinput:set-value", anotherText);
		expect($("#myinput").find("input").val()).toEqual(anotherText);
		expect(_bus.send).toHaveBeenCalledWith("ui-input-field:myinput:value-changed", anotherText);
	});

	it("appends text on append", function() {
		var inputText = "Input text";
		var anotherText = "Another text";

		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});
		$("#myinput").find("input").val(inputText);

		_bus.send("ui-input-field:myinput:append", anotherText);
		expect($("#myinput").find("input").val()).toEqual(inputText + anotherText);
	});

	it("calls function on keyup", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});

		var text;
		_bus.send("ui-input-field:myinput:keyup", function(t) {
			text = t;
		});

		var input = $("#myinput").find("input");
		input.val("mytext");
		input.keyup();

		expect(text).toEqual("mytext");
	});

	it("adds placeholder if type is file", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId,
			type : "file"
		});
		var placeholder = $("#myinput").find(".ui-file-input-placeholder");
		expect(placeholder.length).toBe(1);
	});

	it("sets placeholder text on 'set-value' and 'append' if type is file", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId,
			type : "file"
		});

		_bus.send("ui-input-field:myinput:set-value", "IMG_1047.jpg");

		var placeholder = $("#myinput").find(".ui-file-input-placeholder");
		expect(placeholder.text()).toBe("IMG_1047.jpg");

		_bus.send("ui-input-field:myinput:append", "/IMG_1047.jpg");
		expect(placeholder.text()).toBe("IMG_1047.jpg/IMG_1047.jpg");
	});

	it("sends ui-input-field:<id>:value-changed", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});

		var input = $("#myinput").find("input");
		input.val("foo");
		input.change();
		expect(_bus.send).toHaveBeenCalledWith("ui-input-field:myinput:value-changed", "foo");
	});

	it("adds step=any for number fields", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			type : "number",
			parentDiv : parentId
		});

		var input = $("#myinput").find("input");
		expect(input.attr("step")).toBe("any");
	});

	it("fills values with actual types (number, date,...) instead of strings", function() {
		_bus.send("ui-input-field:create", {
			div : "mynumber",
			type : "number",
			parentDiv : parentId
		});
		_bus.send("ui-input-field:create", {
			div : "mydate",
			type : "date",
			parentDiv : parentId
		});

		var number = $("#mynumber").find("input");
		number.val(57.6);
		var date = $("#mydate").find("input");
		date.val("2016-06-10");

		var message = {};
		_bus.send("mynumber-field-value-fill", message);
		expect(message["mynumber"]).toEqual(57.6);
		expect(typeof message["mynumber"]).toBe("number");

		message = {};
		_bus.send("mydate-field-value-fill", message);
		expect(message["mydate"]).toEqual("2016-06-10T00:00:00.000Z");
		expect(typeof message["mydate"]).toBe("string");
	});
});