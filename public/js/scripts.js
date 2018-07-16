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
      $('#item-name').val("");
      console.log(response);
      $(".items-container").append(`
        <section class="item">
          <section class="item-left">
            <p>${itemName}</p>
            <input type="checkbox" name="item" value="false">Packed<br>
          </section>
          <section class="item-right">
            <button id="${response.id}" class="delete-btn btn">Delete</button>
          </section>
        </section>          
      `);
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
            <input id="${item.id}" type="checkbox" name="item" ${item.item_packed ? "checked" : ""}>Packed<br>
          </section>
          <section class="item-right">
            <button id="${item.id}" class="delete-btn btn">Delete</button>
          </section>
        </section>          
      `);
    }))
    .catch(error => console.log(error));
});

const deleteItem = (id) => {
  const deleteBtnElement = event.target;
  deleteBtnElement.closest('.item').remove();

  fetch(`/api/v1/items/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
};

const updatePacked = (id, value) => {

  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      value
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
};

$(".items-container").on( "click", ".delete-btn", function (event) {
  const id = event.target.id;
  deleteItem(id);
});

$(".items-container").on("click", "input:checkbox", function (event) {
  const id = event.target.id;
  const value = ($(this).is(":checked"));

  updatePacked(id, value);
});

$(".add-item").on("click", grabItem);