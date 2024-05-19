//

// Map to store stock name to ID mapping
const stockIdMap = {};

function fetchAndDisplayStockData() {
  // Fetch all data from API
  $.get("https://stocktrafficcontrol.online/getDwh", function (data) {
    // Sort data based on net earnings in ascending order
    const allStocks = data.sort((a,b)=>{
      if(a.isRemoved === b.isRemoved){
      if(a.toBuy !== b.toBuy){
      return a.toBuy ? 1:-1;
      }
      return (a.budget >= b.budget) ? -1: 1;
      }
      return a.isRemoved ? 1 : -1;
      });

    // Create DataTable
    const table = $("<table>").attr("id", "stockTable").addClass("display");
    const thead = $("<thead>").appendTo(table);
    const tbody = $("<tbody>").appendTo(table);

    // Create table header
    const headerRow = $("<tr>").appendTo(thead);
    $("<th>").text("Stock Name").appendTo(headerRow);
    $("<th>").text("Open to buy").appendTo(headerRow);
    $("<th>").text("Budget").appendTo(headerRow);

    // Populate stockIdMap and table rows with data
    allStocks.forEach((item) => {
      // Populate stockIdMap
      stockIdMap[item.stockName] = item.stockId;

      const row = $("<tr>").appendTo(tbody);
      $("<td>").text(item.stockName).appendTo(row);
      $("<td>")
        .text(item.toBuy ? "Yes" : "No")
        .appendTo(row);
      const budgetCell = $("<td>")
        .addClass("editable")
        .text(item.budget)
        .appendTo(row);


      // Style row based on requirements
      if (item.isRemoved) {
        row.addClass("removed");
        row.css("background-color", "grey");
      } else if (item.toBuy) {
        row.addClass("toBeRemoved");
        // row.css("background-color", "#F7D415");
      }
    });

    // Append DataTable to container and initialize DataTable
    $("#tableContainer").empty().append(table);
    $("#stockTable").DataTable({
      paging: true, // Enable pagination
      searching: true, // Enable search functionality
      ordering: false, // Enable sorting
      info: false, // Disable showing information
      pageLength: 25,
    });
  });
}


$(document).ready(function () {
  fetchAndDisplayStockData();

  // Enable cell editing on click
  $(document).on("click", ".editable", function () {
    $(this).attr("contenteditable", true).focus();
    $(this).addClass("editableActive");
  });
});