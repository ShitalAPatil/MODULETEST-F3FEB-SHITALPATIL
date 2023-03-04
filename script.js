

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsSection = document.getElementById('results');
const historyList = document.getElementById('history-list');
const clearBtn = document.getElementById('clear-btn');

const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
const SEARCH_HISTORY_KEY = 'search-history';

let searchHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [ ];

function searchBooks(query) {
  fetch(API_URL + query)
    .then(response => response.json())
    .then(data => {
      resultsSection.innerHTML = '';

      data.items.forEach(book => {
        const title = book.volumeInfo.title;
        const authors = book.volumeInfo.authors?.join(', ');
        const cover = book.volumeInfo.imageLinks?.thumbnail;
        const publisher = book.volumeInfo.publisher;
        const publishedDate = book.volumeInfo.publishedDate;
        const pageCount = book.volumeInfo.pageCount;
        const averageRating = book.volumeInfo.averageRating;
        const description = book.volumeInfo.description;

const bookElement = `
          <div class="book">
            <img src="${cover || 'https://via.placeholder.com/150'}" alt="${title}">
            <h3>${title}</h3>
            <p><strong>Author(s):</strong> ${authors}</p>
            <p><strong>Publisher:</strong> ${publisher}</p>
            <p><strong>Published Date:</strong> ${publishedDate}</p>
            <p><strong>Page Count:</strong> ${pageCount}</p>
            <p><strong>Average Rating:</strong> ${averageRating}</p>
             <p><strong>Description:</strong> ${description}</p>
          </div>
        `;
             resultsSection.insertAdjacentHTML('beforeend', bookElement);
      });
      if (!searchHistory.includes(query)) {
        searchHistory.push(query);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
        displaySearchHistory();
      }
    })
    .catch(error => console.error(error));
}
function displaySearchHistory() {
  historyList.innerHTML = '';

  searchHistory.forEach(query => {
    const historyItem = `<li><a href="#" data-query="${query}">${query}</a></li>`;
    historyList.insertAdjacentHTML('beforeend', historyItem);
  });
}

function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (query) {
    searchBooks(query);
    searchInput.value = '';
  }
}
function handleSearchHistoryClick(event) {
  event.preventDefault();
  const query = event.target.dataset.query;

  if (query) {
    searchInput.value = query;
    searchBooks(query);
  }
}
function handleClearHistory() {
  searchHistory = [];
  localStorage.removeItem(SEARCH_HISTORY_KEY);
  displaySearchHistory();
}
searchForm.addEventListener('submit', handleSearch);
historyList.addEventListener('click', handleSearchHistoryClick);
clearBtn.addEventListener('click', handleClearHistory);
displaySearchHistory();


