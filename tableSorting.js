const url = 'http://localhost:3210/' // наш сервер

//отправляем заапрос сервису(service_sql.js)

// мы делаем запрос к нашей бд, где уже есть все результаты выборки
// данные нам приходят в виде строки и потом мы используем json(), чтобы потом можно было работать с данными полученными
fetch(`${url}test`)
    .then(res => res.json()) //получаем данные(res)
    .then((res) => {
        loadTablle(res); //метод загрузки таблицы
    })
    .catch((err) => console.log(err)); // думаю ты уже понимаешь как работают промисы (https://learn.javascript.ru/fetch)


//метод загрузки таблицы
function loadTablle(rows) {

    let pagination = document.querySelector('#pagination'); //ul-ки
    let table = document.querySelector('#table'); //таблица

    //сколько записей(строк) вывести в страничке, можно менять значение
    let notesOnPage = 6;

    //сколько страничек получим (количество кнопок для пагинации)
    const countOfPagination = Math.ceil(rows.length / notesOnPage);

    //генерация кнопок для пагинации
    let items = []; // мы туда наши кнопки  помещаем
    for (let i = 1; i <= countOfPagination; i++) { // формируем 
        const li = document.createElement('li'); // создаем элемент списка
        li.innerHTML = i; // номер страницы, который отображает на кнопке
        pagination.appendChild(li); // добавляем в контейнер кнопок нашу кнопку
        items.push(li); // также помешаем в массив наш элемент
    }

    let liActive; // переменная, которая будет говорить, что мы находимся на такой то страничке? нет, тут лежит именно тот самый элемент,
    // который активен))
    showTable(items[0]); // генерируем таблицу на первой странице?)


    for (const item of items) { // так кнопок может быть много, то нам нужно положить слушатель на событие "нажатие кнопки пагинации" должен быть в массиве
        // то есть мы нажимаем на какую то из кнопок и отрисовываем таблицу для этой страницы
        item.addEventListener('click', function() {
            showTable(this); // this обращаемся к нашему контексту цикла, то есть к нашему item (его слушаем)
            // наверное)) я не особо умная, могу ошибаться
        })
    };

    //генерация таблицы
    function showTable(item) {
        if (liActive) { // промеряем наличие этого элемента
            liActive.classList.remove('active'); // удаляем класс
        }
        liActive = item; // переназначаем активную кнопку
        item.classList.add('active'); // добавляем к ней класс

        // короче, мы нажали на кнопочку другую (были допустим на первой перешли на третью)
        // теперь нам нужно удалить класс active (css уже это), так как она уже неактивная, и передаем уже 3 кнопке

        let pageNum = item.innerHTML; // номер страницы

        let start = (pageNum - 1) * notesOnPage; // первая запись в таблице, которая на этой страинце (высчитываем ее номер в бд)
        let end = start + notesOnPage; // последняя
        let notes = rows.slice(start, end) // из результаты вырезаем именно те строчки, которые отрисовываем именно на этой странице

        table.innerHTML = ''; // очищаем таблицу (имеено контейнер)
        let tr = document.createElement('tr'); // создаем строку
        let thead = document.createElement('thead'); //  создаем шапку таблицы
        thead.appendChild(tr); // добавляем  в контейнер таблицы
        table.appendChild(thead); // добавляем  в контейнер таблицы

        //Таблица должна иметь сортировку по всем полям кроме даты
        //поэтому 3-й параметр false у Date
        createRowHead(tr, 'Date', false); // добавляем ячейку head и тд
        createRowHead(tr, 'Name');
        createRowHead(tr, 'Count');
        createRowHead(tr, 'Distance');

        let tbody = document.createElement('tbody'); // тело таблицы
        table.appendChild(tbody); // добавляем в контейнер
        for (let note of notes) { // создаем строчки  (note - запись из масиива записей из бд)
            let tr = document.createElement('tr'); // строка
            tbody.appendChild(tr); // добавляем в тело

            createRow(tr, note.date); // выводим дату в ячейку даты в строке и тд
            createRow(tr, note.name);
            createRow(tr, note.count);
            createRow(tr, note.distance);

        }

    }

    // добавляем инфу в строку (по ячейкам)
    function createRow(tr, cellValue) {
        let td = document.createElement('td'); // ячейка
        td.innerHTML = cellValue; // помещаем в нее информацию из бд (поле дата и тп)
        tr.appendChild(td); // добавляем в строку
    }

    function createRowHead(tr, cellValue, isSorting = true) { // создаем шапку и говорим, что они сортируются ( если явно не передали, что она не сортируемая)
        let th = document.createElement('th');
        th.innerHTML = cellValue; // название поля
        if (isSorting) {
            th.addEventListener('click', () => getSort(event)); // если столбец сортируется, мы добавляем слушателя клика на ячейку этого столбца в шапке 
        }
        tr.appendChild(th);
    }




    //фунция сортировки
    const getSort = ({ target }) => {

        // не могу пока понять что это
        // в функции comparator похоже на то, что мы каждому элементу столбца дали какой то порядок
        const order = (target.dataset.order = -(target.dataset.order || -1));
        // Берем из Event https://developer.mozilla.org/ru/docs/Web/API/Event
        // Свойство dataset появилось совсем недавно (спецификация) и выполняет такую же роль, только без jQuery. 
        // Оно позволяет из javascript получить доступ в режиме чтения и записи к атрибутам data-*, установленным для html-элемента.


        const index = [...target.parentNode.cells].indexOf(target); // у нас есть наши ячейки куда кликаем. берем индекс той, на которую нажали
        //https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf


        const collator = new Intl.Collator(['en', 'ru'], { numeric: true }); // впервые вижу... что это такое... *изучаю*
        // прикоооольно))
        // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
        // numeric
        // Определяет, должно ли использоваться числовое сравнение, то есть, чтобы выполнялось условие "1" < "2" < "10". 
        // Возможными значениями являются true и false; значением по умолчанию является false. 
        // Эта опция может быть установлена через свойство аргумента options, либо через ключ расширения Unicode; 
        // если предоставлены оба значения, свойство аргумента options имеет приоритет.
        //  Реализации не обязаны поддерживать это свойство.

        // вот тут мы сравниваем 
        // берем два элемента из колонки под номером index
        const comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );

        // Метод Element.closest() возвращает ближайший родительский элемент (или сам элемент), 
        // который соответствует заданному CSS-селектору или null, если таковых элементов вообще нет.
        for (const tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));
        //  берем все строки и сортируем их в порядке нужном (функция comparator все элементы отсортировала при сравнении двух элементов)

        for (const cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target); // каждой ячейку даем класс sorted
    };
}