define([ "geoladris-tests" ], function(tests) {
  describe("input", function() {
    var bus;
    var injector;
    var module;
    var commons;
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {}, {
        "pikaday" : "../jslib/pikaday/1.5.1/pikaday",
        "pikaday.jquery" : "../jslib/pikaday/1.5.1/pikaday.jquery",
        "typeahead" : "../jslib/typeahead/0.10.2/typeahead.jquery.min"
      });
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "commons", "input" ], function(c, m) {
        commons = c;
        spyOn(commons, "linkDisplay").and.callThrough();

        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates container with elements", function() {
      module({
        id : "myinput",
        parent : parentId
      });

      var parent = document.getElementById(parentId);
      expect(parent.children.length).toBe(1);
      var container = parent.children[0];
      var input = document.getElementById("myinput");
      expect(input).not.toBe(null);
      expect(input.parentNode).toBe(container);
      expect(container.getElementsByTagName("label").length).toBe(1);
    });

    it("adds label if specified on create", function() {
      var text = "Input: ";
      var input = module({
        id : "myinput",
        parent : parentId,
        label : text
      });

      var label = input.parentNode.querySelector("label");
      expect(label).not.toBe(null);
      expect(label.innerHTML).toEqual(text);
    });

    it("sets input type if specified on create", function() {
      var input = module({
        id : "myinput",
        parent : parentId,
        type : "password"
      });
      expect(input.type).toBe("password");
    });

    it("fills message on -field-value-fill", function() {
      var inputText = "Input Text";
      var input = module({
        id : "myinput",
        parent : parentId
      });
      input.value = inputText;

      var message = {};
      bus.send("myinput-field-value-fill", message);
      expect(message["myinput"]).toEqual(inputText);
    });

    it("adds step=any for number fields", function() {
      var input = module({
        id : "myinput",
        type : "number",
        parent : parentId
      });
      expect(input.step).toBe("any");
    });

    it("fills values with actual types (number, date,...) instead of strings", function() {
      var number = module({
        id : "mynumber",
        type : "number",
        parent : parentId
      });
      var date = module({
        id : "mydate",
        type : "date",
        parent : parentId
      });

      number.value = 57.6;
      date.value = "2016-06-10";

      var message = {};
      bus.send("mynumber-field-value-fill", message);
      expect(message["mynumber"]).toEqual(57.6);
      expect(typeof message["mynumber"]).toBe("number");

      message = {};
      bus.send("mydate-field-value-fill", message);
      expect(message["mydate"]).toEqual("2016-06-10T00:00:00.000Z");
      expect(typeof message["mydate"]).toBe("string");
    });

    it("sets placeholder if specified", function() {
      var placeholder = "Search...";
      var input = module({
        id : "myinput",
        parent : parentId,
        placeholder : placeholder
      });

      expect(input.getAttribute("placeholder")).toEqual(placeholder);
    });

    it("sends event on enter for autocomplete", function() {
      var input = module({
        id : "myinput",
        parent : parentId,
        options : [ "a", "b", "c" ]
      });

      var changed;
      input.addEventListener("change", function() {
        changed = true;
      });
      var e = new Event("keypress");
      e.which = 13;
      input.dispatchEvent(e);

      expect(changed).toBe(true);
    });

    it("links container visibility", function() {
      var input = module({
        id : "myinput",
        parent : parentId,
        options : [ "a", "b", "c" ]
      });

      expect(commons.linkDisplay).toHaveBeenCalled();
      var args = commons.linkDisplay.calls.mostRecent().args;
      expect(args[0].id).toBe(input.id);
      expect(args[1].id).toBe(input.id + "-container");
    });
  });
});