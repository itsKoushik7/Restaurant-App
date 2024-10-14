const foodItems = [
    { id: 1, name: 'Chicken Biryani', course: 'Main Course', price: 180 },
    { id: 2, name: 'Mutton Biryani', course: 'Main Course', price: 230 },
    { id: 3, name: 'Vegetable Biryani', course: 'Main Course', price: 170 },
    { id: 4, name: 'Masala Dosa', course: 'Dish', price: 40 },
    { id: 5, name: 'Idli', course: 'Dish', price: 40 },
    { id: 6, name: 'Sambar', course: 'Side Dish', price: 20 },
    { id: 7, name: 'Vada', course: 'Dish', price: 50 },
    { id: 8, name: 'Rasam', course: 'Soup', price: 40 },
    { id: 9, name: 'Payasam', course: 'Dessert', price: 50 },
    { id: 10, name: 'Coffee', course: 'Beverage', price: 30 }
];

const restaurantTables = [
    { name: 'Table 1', totalItemsOrdered: 0, totalPrice: 0.00, uniqueItems: new Set(), serves: new Map() },
    { name: 'Table 2', totalItemsOrdered: 0, totalPrice: 0.00, uniqueItems: new Set(), serves: new Map()  },
    { name: 'Table 3', totalItemsOrdered: 0, totalPrice: 0.00, uniqueItems: new Set(), serves: new Map()  }
];

// display food items 
function displayFoodItems(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    items.forEach(item => {
        const foodDiv = document.createElement('div');
        foodDiv.setAttribute('draggable', 'true');
        foodDiv.setAttribute('data-item-id', item.id);

        foodDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: ₹${item.price}</p>`;

        // adding styles to the food item container 

        foodDiv.style.border = '1px solid lightgray';
        foodDiv.style.padding = '10px';
        foodDiv.style.marginBottom = '10px';
        foodDiv.style.boxShadow = '2px 2px 5px black';

        // Add dragstart event
        foodDiv.addEventListener('dragstart', DragStart);

        // appending food item 
        container.appendChild(foodDiv);
    });
}

// display tables 
function displayTables(tables) {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    tables.forEach((table, index) => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table-div';
        tableDiv.setAttribute('data-table-index', index);

        tableDiv.innerHTML = `
            ${table.name}<br>
            Items Ordered: ${table.totalItemsOrdered} |
            Total Price: ₹${table.totalPrice}
        `;

        // adding styles to each table container 
        tableDiv.style.border = '2px solid lightgray';
        tableDiv.style.padding = '20px';
        tableDiv.style.marginBottom = '10px';
        tableDiv.style.boxShadow = '2px 2px 5px black';

        //  drop on tables
        tableDiv.addEventListener('dragover', event => event.preventDefault());
        tableDiv.addEventListener('drop', DropEnd);

        tableDiv.addEventListener('click',PopWindow);

        // adding tables list
        tableContainer.appendChild(tableDiv);
    });
}

// handling opending window
function PopWindow(event) {
   
    let container = event.target;
    let rightSide = document.getElementById('menu-container');
    rightSide.style.position = 'fixed';
    let leftSide = document.getElementById('left-container');
    leftSide.style.pointerEvents = 'none';
    let backshadow = document.getElementById('inlineing');
    backshadow.style.opacity = '0.5';
    console.log(container);
    container.style.backgroundColor = 'lightpink';      
    const tableIndex = event.target.getAttribute('data-table-index');
    const tableName = restaurantTables[tableIndex]; 
    displayWindow(tableName,tableIndex);
    
}

function displayWindow(table,tableIndex) {

    console.log(table);
    console.log(table.totalPrice);
    let closeButton = document.getElementById('window-close');
    closeButton.addEventListener('click',(event) => {
        closeWindow(event,table);
    })
    let fullWindow = document.getElementById('order-dialog');
    let head = document.getElementById('window-head');
    head.innerHTML = '';
    let heading = document.createElement('h3');
    heading.innerHTML = `<h2>&nbsp&nbsp&nbsp&nbsp${table.name}&nbsp &nbsp &nbsp | &nbsp &nbsp Order Details </h2><hr>`;
    heading.style.backgroundColor = 'lightblue';
    heading.style.marginTop = '-22px';
    head.appendChild(heading);
    fullWindow.style.zIndex = '6';
    const rows = document.getElementById('tab-in');
    rows.innerHTML = '';
    let count = table.uniqueItems.size;
    const itemsArray = Array.from(table.serves.entries());
    // console.log(itemsArray);
    // console.log(table);
    for (let i=0; i<count; i++) {
        const eachRow = document.createElement('tr');
         //  --- 1st column
        let cell = document.createElement('td');
        cell.innerHTML= '';
        cell.innerHTML= ` &nbsp    &nbsp  &nbsp  &nbsp  &nbsp   ${i+1}` ;
        cell.style.margin = '-20px'
        eachRow.appendChild(cell);     
        // ---- 2nd column        
        cell = document.createElement('td');
        cell.innerHTML= '';
        let fooditem  = itemsArray[i][0];           // console.log(fooditem);     // food item to add
        cell.innerHTML = `${fooditem}`;
        eachRow.appendChild(cell);         
         // ---------3rd column     
        cell = document.createElement('td');
        cell.innerHTML= '';
        const droppedItem = foodItems.find(item => item.name == fooditem);
        let priced = droppedItem.price;
        cell.innerHTML= priced;
        eachRow.appendChild(cell);   
        //-------------4th column          
        cell = document.createElement('td');
        cell.innerHTML= '';
        let c = table.serves.get(fooditem);          // console.log(c);    // default count 
             // --- creating input field
        const serveCount = document.createElement('input');     // append the input
        serveCount.setAttribute('type','number');
        serveCount.setAttribute('value',c);
        serveCount.setAttribute('min','1')
        // let tabIndex = table.getAttribute('data-table-index')
        serveCount.addEventListener('input',function(event) {
            inputChange(event, fooditem, table,table.serves.get(fooditem),tableIndex);
        });   
        cell.appendChild(serveCount);                          
        eachRow.appendChild(cell); 
        // --------- 5th column
        cell = document.createElement('td');
        cell.setAttribute('class','fa fa-trash');
        cell.style.marginLeft = '60px';
        cell.style.marginTop = '16px';
        cell.innerHTML= '';
        const del = document.createElement('p');
        del.innerHTML = '';
        cell.addEventListener('click',(event) => {
            removeWindowItem(event,fooditem,table,tableIndex);
        });         // have to write removeWindowItem
        cell.appendChild(del);
        eachRow.appendChild(cell);
        rows.appendChild(eachRow);
    }


    const billGen = document.getElementById('bill');
    billGen.innerHTML = "";
    billGen.innerHTML = ' Close | Generate Bill'

    const amount = document.getElementById('total');
    amount.innerHTML = `Total : ${table.totalPrice}`;

    billGen.addEventListener('click', (event) => {
        billGenerate(event,table);
    })
  
}

function inputChange(event,itemName,table,prev,tableIndex) {
    let num = event.target.value;
    const dropping = foodItems.find(item => item.name == itemName);
    console.log("previos :",prev,"   num :",num);
    num =Number(num);
    console.log(typeof(num));
   
    let itemPrice = dropping.price;
    if(num > prev) {
        table.totalPrice += itemPrice;
    }
    else if(num < prev) {
        table.totalPrice -= itemPrice;
    }
    table.serves.set(itemName,num);
   
   console.log(table.totalPrice)

   // adjusting final amount in dialog box
   let finalAmount = document.getElementById('total');
    finalAmount.innerHTML = '';
   let amount = table.totalPrice;
   finalAmount.innerHTML = ` Total : ${amount}.00`;

    displayTables(restaurantTables);
       
    const updatedContainer = document.querySelector(`[data-table-index='${tableIndex}']`);
    //console.log(updatedContainer)
   updatedContainer.style.backgroundColor = 'lightpink'; 
   
}

function closeWindow(event,table) {
    let fullWindow = document.getElementById('order-dialog');
    const rows = document.getElementById('tab-in');

    let finalAmount = document.getElementById('total');
    finalAmount.innerHTML= '';

    let rightSide = document.getElementById('menu-container');
    rightSide.style.position = 'relative';
    let leftSide = document.getElementById('left-container');
    leftSide.style.pointerEvents = 'auto';
    let backshadow = document.getElementById('inlineing');
    backshadow.style.opacity = '1';
    fullWindow.style.zIndex = '-1';
    displayTables(restaurantTables);

}

function billGenerate(event,table,finalBill) {
    let fullWindow = document.getElementById('order-dialog');
    const rows = document.getElementById('tab-in');
    const billGen = document.getElementById('bill');
    billGen.innerHTML = '';
    //fullWindow.removeChild(finalBill);
    let amount = table.totalPrice;
    alert(`The toal Bill Amount : ${amount}.00`);
    rows.innerHTML = '';
    console.log(table);
    table.serves.clear();
    table.uniqueItems.clear();
    table.totalPrice=0;
    table.totalItemsOrdered = 0;

    // resetting backgorund 
    let rightSide = document.getElementById('menu-container');
    rightSide.style.position = 'relative';
    let leftSide = document.getElementById('left-container');
    leftSide.style.pointerEvents = 'auto';
    let backshadow = document.getElementById('inlineing');
    backshadow.style.opacity = '1';
    
   // fullWindow.style.backgroundColor = 'black';
   displayTables(restaurantTables);
        
    
    fullWindow.style.zIndex = '-1';
}

function  removeWindowItem(event,fooditem,table,tableIndex) {
    const dropping = foodItems.find(item => item.name == fooditem);
    let itemPrice = dropping.price;
    let itemCount = table.serves.get(fooditem);
    table.totalPrice = table.totalPrice - ( itemPrice * itemCount);
    table.serves.delete(fooditem);
    table.totalItemsOrdered = table.totalItemsOrdered - 1;

    // adjusting final amount in dialog box 
    let finalAmount = document.getElementById('total');
    finalAmount.innerHTML = '';
   let amount = table.totalPrice;
   finalAmount.innerHTML = '';
   finalAmount.innerHTML = ` Total : ${amount}.00`;

    displayTables(restaurantTables);
    const updatedContainer = document.querySelector(`[data-table-index='${tableIndex}']`);
    //console.log(updatedContainer)
   updatedContainer.style.backgroundColor = 'lightpink';
    const rows = document.getElementById('tab-in');
    rows.innerHTML = '';
    displayWindow(table);
    
    
}

// dragging food items
function DragStart(event) {
    const itemId = event.target.getAttribute('data-item-id');
    
    event.dataTransfer.setData('text/plain', itemId);
}

// dropping food items on tables
function DropEnd(event) {
    const tableIndex = event.target.getAttribute('data-table-index');
    const itemId = event.dataTransfer.getData('text/plain');
    
    const droppedItem = foodItems.find(item => item.id == itemId);
    // console.log(droppedItem);
    let itemName = droppedItem.name;
    const table = restaurantTables[tableIndex];
    let num = table.serves.get(itemName);
    if(isNaN(num)){
        num=1
    }
    else{
        num++;
    }
    table.serves.set(itemName,num);
    table.uniqueItems.add(droppedItem.id);
    table.totalPrice += droppedItem.price;
    table.totalItemsOrdered = table.uniqueItems.size;

    displayTables(restaurantTables);
}

// Filtering food items
function filterAndSortFoodItems(val) {
    const lowerVal = val.toLowerCase().trim();
    const filteredItems = foodItems.filter(item =>
        item.name.toLowerCase().includes(lowerVal) ||
        item.course.toLowerCase().includes(lowerVal)
    );
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    displayFoodItems(filteredItems);
}

// Filtering  tables
function filterAndSortTables(val) {
    const getVal = val.toLowerCase().trim();
    const filteredTables = restaurantTables.filter(table =>
        table.name.toLowerCase().includes(getVal)
    );
    //filteredTables.sort((a, b) => a.name.localeCompare(b.name));
    displayTables(filteredTables);
}

// Event listeners for search inputs
document.getElementById('item-search').addEventListener('input', (event) => {
    const val = event.target.value;
    filterAndSortFoodItems(val);
});
document.getElementById('table-search').addEventListener('input', (event) => {
    const val = event.target.value;
    filterAndSortTables(val);
});
// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    displayTables(restaurantTables);
    displayFoodItems(foodItems);
});
