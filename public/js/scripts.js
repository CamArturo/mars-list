const grabItem = () => {
  const itemName = $("#item-name").val();

  fetch("/api/v1/items", {
    method: "POST",
    body: JSON.stringify({
      item_name: itemName,
      item_packed: false
    }),
    headers: {
      "content-type": "application/json"
    }
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
    })
    .catch(error => console.log(error));
};

$(function () {
  fetch("/api/v1/items", {
    method: "GET"
  })
    .then(response => response.json())
    .then(response => response.forEach(item => {
      $(".items-container").append(`
        <section class="item">
          <section class="item-left">
            <p>${item.item_name}</p>
            <input type="checkbox" name="item" value="${item.item_packed}">Packed<br>
          </section>
          <section class="item-right">
            <button id="${item.id}" class="delete-btn btn">Delete</button>
          </section>
        </section>          
      `);
    }))
    .catch(error => console.log(error));
});

$(".add-item").on("click", grabItem);