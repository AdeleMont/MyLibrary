document.addEventListener('DOMContentLoaded', () => {
  renderList();
});


let books = JSON.parse(localStorage.getItem('books')) || [];

function addBook(button) {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const genre = document.getElementById('genre').value;
  const status = document.getElementById('status').value;

  if (!title || !author) {
    alert('Пожалуйста, заполните  поля "Название" и "Автор"');
    return;
  }

  const newBook = { title, author, year, genre, status };
  books.push(newBook);
  localStorage.setItem('books', JSON.stringify(books));
  renderList();


  let inputs = document.querySelectorAll('input');
  inputs.forEach((element) => element.value = '')
}

function renderList() {
  books = JSON.parse(localStorage.getItem('books')) || [];
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';

  books.forEach(book => {
    const li = document.createElement('li');

    li.classList.add("list-group");
    li.setAttribute("data-status", `${book.status}`);
    li.innerHTML = `
    <div>
    Название: ${book.title}  Автор: ${book.author} Год издания: ${book.year || 'Не указан'}
      Жанр: ${book.genre} Статус: ${book.status}
    </div>
    <div>
      <button class="button button__delete" onclick="deleteItem(this)">Удалить</button>
      <button class="button" onclick="editItem(this)">Редактировать</button>
    </div>
`;
    bookList.appendChild(li);
  });

  getCount();
}


function deleteItem(button) {
  const div = button.parentElement;
  const li = div.parentElement; 
  const index = Array.from(li.parentNode.children).indexOf(li); 

  books.splice(index, 1); 
  localStorage.setItem('books', JSON.stringify(books)); 
  li.remove(); 
  renderList(); 
}

function refreshList() {
  location.reload();
  renderList();
}

function clearList() {

  const deleteConfirm = confirm('Вы действительно хотите удалить все книги из списка?');

  if (deleteConfirm) {
    books = [];
    localStorage.removeItem('books');
    renderList();

  } else {
    return
  }
}


function getCount() {
  document.getElementById('book-count').textContent = books.length;

}


//Фильтр по статусу

let statusFilterSelect = document.querySelector('#statusFilter');
statusFilterSelect.value = 'all';

function getStatus() {
  statusFilterSelect.addEventListener('change', (e) => {
    return statusFilterSelect.value;
  })
}

const statusBtn = document.querySelector('#statusBtn');

statusBtn.addEventListener('click', (e) => {
  getStatus();

  const selectedStatus = statusFilterSelect.value;
  console.log('selectedStatus', selectedStatus);
  const bookList = document.getElementById('book-list');
  const books = bookList.querySelectorAll('li');


  books.forEach(book => {
    if (selectedStatus === 'all' || book.dataset.status === selectedStatus) {
      book.style.display = 'flex';
    } else {
      book.style.display = 'none';
    }
  });

})



// Редактировать книгу

function editItem(button) {
  const div = button.parentElement;
  const li = div.parentElement;
  const editedBookIndex = Array.from(li.parentNode.children).indexOf(li);
  li.innerHTML = '';

  const editForm = document.createElement('form');
  editForm.classList.add('book-item');
  editForm.innerHTML = `

    <label for="title">Название:</label>
    <input type="text" name="title" value="${books[editedBookIndex].title}">
    <label for="author">Автор:</label>
    <input type="text" name="author" value="${books[editedBookIndex].author}">
    <label for="year">Год издания:</label>
    <input type="number" name="year" value="${books[editedBookIndex].year}" >
            <br>
            <label for="genre">Жанр:</label>
            <select name="genre" id="genre">
                <option value="Поэзия">Поэзия</option>
                <option value="Художественная литература">Художественная литература</option>
                <option value="Документальная литература">Документальная литература</option>
                <option value="Драма">Драма</option>
            </select>
            <label for="status">Статус:</label>
            <select name="status" id="status">
                <option value="read">Прочитано</option>
                <option value="unread">Не прочитано</option>
            </select>
    <button class="button" type="submit">Сохранить</button>
  `;
  li.appendChild(editForm);


  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(editForm);
    const editedBook = Object.fromEntries(formData.entries());
    books[editedBookIndex] = editedBook;
    localStorage.setItem('books', JSON.stringify(books));
    renderList();
  });
}






