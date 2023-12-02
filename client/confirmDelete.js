import jQuery from "jquery";

const $ = jQuery;

export const useConfirmDelete = (selector, onDelete) => {
  let pendingDeleteId = undefined;
  const deleteButtons = $(selector);
  deleteButtons.on("click", async (e) => {
    e.stopPropagation();
    if (pendingDeleteId === e.target.dataset.id) {
      onDelete(e.target.dataset.id);
      window.location.reload();
    } else {
      deleteButtons.text("Delete");
      deleteButtons.removeClass("btn-danger");
      deleteButtons.addClass("btn-warning");
      pendingDeleteId = e.target.dataset.id;
      e.target.innerText = "Confirm Delete";
      e.target.classList.add("btn-danger");
      e.target.classList.remove("btn-warning");
    }
  });
};
