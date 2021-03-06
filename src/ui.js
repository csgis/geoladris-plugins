define(["jquery", "message-bus", "module", //
    "./accordion-group", "./alerts", "./buttons", "./checkbox", "./choice", //
    "./commons", "./confirm-dialog", "./dialog", "./divstack", //
    "./dropdown-buttons", "./form-collector", "./input", "./loading", "./radio", //
    "./slider", "./sliding-div", "./table", "./text-area", "sortable", "tooltip.js"
  ], //
function($, bus, module, //
  accordionGroup, alerts, buttons, checkbox, choice, //
  commons, confirmDialog, dialog, divstack, //
  dropdownButtons, formCollector, input, loading, radio, //
  slider, slidingDiv, table, textArea, Sortable, Tooltip) {
  bus.listen("ui-show", function(e, id) {
    document.getElementById(id).style.display = "";
  });

  bus.listen("ui-hide", function(e, id) {
    document.getElementById(id).style.display = "none";
  });

  bus.listen("ui-toggle", function(e, id) {
    var e = document.getElementById(id);
    e.style.display = e.style.display == "none" ? "" : "none";
  });

  bus.listen("ui-open-url", function(e, msg) {
    window.open(msg.url, msg.target);
  });

  bus.listen("modules-loaded", function() {
    bus.send("ui-loaded");
  });

  return {
    create: function(type, props) {
      // Do not create if already exists
      var e = document.getElementById(props.id);
      if (e) {
        return e;
      }

      switch (type) {
        case "accordion-group":
          e = accordionGroup(props);
          break;
        case "autocomplete":
          e = autocomplete(props);
          break;
        case "button":
          e = buttons(props);
          break;
        case "checkbox":
          e = checkbox(props);
          break;
        case "choice":
          e = choice(props);
          break;
        case "confirm-dialog":
          e = confirmDialog(props);
          break;
        case "dialog":
          e = dialog(props);
          break;
        case "divstack":
          e = divstack(props);
          break;
        case "dropdown-button":
          e = dropdownButtons(props);
          break;
        case "input":
          e = input(props);
          break;
        case "radio":
          e = radio(props);
          break;
        case "slider":
          e = slider(props);
          break;
        case "sliding-div":
          e = slidingDiv(props);
          break;
        case "table-ext":
          e = table(props);
          break;
        case "text-area":
          e = textArea(props);
          break;
        default:
          e = commons.getOrCreateElem(type, props);
          break;
      }

      if (e) {
        bus.send("ui:created", e);
      }
      return e;
    },
    tooltip: function(elem, props) {
      if (typeof elem == "string") {
        elem = document.getElementById(elem);
      }
      var tooltip = new Tooltip(elem, {
        placement: props.location,
        html: true,
        title: props.text
      });
      tooltip.show();
      return tooltip._tooltipNode;
    },
    sortable: function(elem) {
      if (typeof elem == "string") {
        elem = document.getElementById(elem);
      }

      Sortable.create(elem, {
        onSort: function(e) {
          elem.dispatchEvent(new CustomEvent("change", {
            detail: {
              item: e.item,
              newIndex: e.newIndex,
              oldIndex: e.oldIndex
            }
          }));
        }
      });
    }
  }
});
