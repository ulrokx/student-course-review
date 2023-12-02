import jQuery from "jquery";

const $ = jQuery;

export const useEditList = (id, onChange) => {
  const input = $(`#${id}-input`);
  const list = $(`#${id}-list`);
  const addButton = $(`#${id}-add-button`);

  input.on("change keydown paste input", (e) => {
    e.stopPropagation();
    if (input.val().trim() === "") {
      addButton.attr("disabled", true);
    } else {
      addButton.attr("disabled", false);
    }
  });

  const remove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    $(e.target).closest("li").remove();
    onChange();
  };

  list.find("li").find("button").on("click", remove);

  const add = (item) => {
    input.val("");
    addButton.attr("disabled", true);
    list.append(
      $("<li>")
        .addClass("list-group-item")
        .append([
          $("<button>")
            .addClass("btn btn-danger")
            .text("Remove")
            .attr("type", "button")
            .on("click", remove),
          $("<span>").text(item).addClass("ml-2"),
        ]),
    );
    onChange();
  };

  addButton.on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    add(input.val().trim());
  });

  input.on("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      add(input.val().trim());
    }
  });

  const getItems = () => {
    return list
      .find("li")
      .find("span")
      .toArray()
      .map((e) => $(e).text());
  };

  return getItems;
};
