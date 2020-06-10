const url = 'http://localhost:3210/'

//отправляем заапрос сервису(service_sql.js)
fetch(`${url}test`)
  .then(res => res.json())//получаем данные(res)
  .then((res) => {
    loadTablle(res); //метод загрузки таблицы
  })
  .catch((err) => console.log(err));


function loadTablle(rows) {

  let pagination = document.querySelector('#pagination');//ul-ки
  let table = document.querySelector('#table');//таблица

  //сколько записей(строк) вывести в страничке, можно менять значение
  let notesOnPage = 6;

  //сколько страничек получим (количество кнопок для пагинации)
  const countOfPagination = Math.ceil(rows.length / notesOnPage);

  //генерация кнопок для пагинации
  let items = [];
  for (let i = 1; i <= countOfPagination; i++) {
    const li = document.createElement('li');
    li.innerHTML = i;
    pagination.appendChild(li);
    items.push(li);
  }

  let liActive;
  showTable(items[0]);


  for (const item of items) {
    item.addEventListener('click', function () {
      showTable(this);
    }
    )
  };

  //генерация таблицы
  function showTable(item) {
    if (liActive) {
      liActive.classList.remove('active');
    }
    liActive = item;
    item.classList.add('active');

    let pageNum = item.innerHTML;

    let start = (pageNum - 1) * notesOnPage;
    let end = start + notesOnPage;
    let notes = rows.slice(start, end)

    table.innerHTML = '';
    let tr = document.createElement('tr');
    let thead = document.createElement('thead');
    thead.appendChild(tr);
    table.appendChild(thead);
    //Таблица должна иметь сортировку по всем полям кроме даты
    //поэтому 3-й параметр false у Date
    createRowHead(tr, 'Date', false);
    createRowHead(tr, 'Name');
    createRowHead(tr, 'Count');
    createRowHead(tr, 'Distance');

    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    for (let note of notes) {
      let tr = document.createElement('tr');
      tbody.appendChild(tr);

      createRow(tr, note.date);
      createRow(tr, note.name);
      createRow(tr, note.count);
      createRow(tr, note.distance);

    }

  }

  function createRow(tr, cellValue) {
    let td = document.createElement('td');
    td.innerHTML = cellValue;
    tr.appendChild(td);
  }

  function createRowHead(tr, cellValue, isSorting = true) {
    let th = document.createElement('th');
    th.innerHTML = cellValue;
    if (isSorting) {
      th.addEventListener('click', () => getSort(event));
    }
    tr.appendChild(th);
  }




  //фунция сортировки
  const getSort = ({ target }) => {
    const order = (target.dataset.order = -(target.dataset.order || -1));
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
    const comparator = (index, order) => (a, b) => order * collator.compare(
      a.children[index].innerHTML,
      b.children[index].innerHTML
    );

    for (const tBody of target.closest('table').tBodies)
      tBody.append(...[...tBody.rows].sort(comparator(index, order)));

    for (const cell of target.parentNode.cells)
      cell.classList.toggle('sorted', cell === target);
  };
}

