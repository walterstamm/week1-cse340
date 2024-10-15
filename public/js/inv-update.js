const form = document.querySelector("#editInventoryForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button[type='submit']")
      updateBtn.removeAttribute("disabled")
    })