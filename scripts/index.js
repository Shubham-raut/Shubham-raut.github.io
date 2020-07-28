document.addEventListener('DOMContentLoaded', () => {

  // variables
  const toggleSwitch = document.querySelector('#toggle_action');
  const apiKey = '8e95294833274be596982168d0d69a89';
  const article_area = document.querySelector("#news-articles");
  const search = document.querySelector('#search');
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  let searchTxt = '';
  let sudoUrl = 'https://newsapi.org/v2/top-headlines?country=in&apiKey=';

  // Function Showing News
  const showNews = (response) => {
    let output = "";

    if (response.totalResults > 0) {
      response.articles.forEach(news => {
        output +=
          ` <section class="container">
              <li class="article"><a class="article-link" href="${news.url}" >
                  <div class="img_area">
                  <img src="${news.urlToImage}" class="article-img" alt="${news.title}"></img>
                  </div>
                  <h2 class="article-title">${news.title}</h2>
                  <p class="article-description">${news.description || "Description not available"}</p>
                  <span class="article-author">-${news.author ? news.author : "Anonymous"}</span>
                  </a>
                  </li>
                  </section>
                  `;
      });
      article_area.innerHTML = output;
    }
    else {
      article_area.innerHTML = '<li class="not-found">No article was found based on the search.</li>';
    }
  };

  // fetching news
  const fetchNews = async (searchTxt) => {

    // // for showing loading menu
    let dotLen = 0;
    let loadTxt = 'Loading News';
    let dots = setInterval(() => {
      if (dotLen <= 3) {
        article_area.innerHTML = `<p class="load">${loadTxt}</p>`;
        loadTxt += '.';
        dotLen += 1;
      }
      else {
        dotLen = 0;
        loadTxt = 'Loading News';
      }
    }, 200);

    // fetching data
    try {
      if (searchTxt) {
        sudoUrl = 'https://newsapi.org/v2/everything?q=' + searchTxt + '&apiKey=';
      }
      let url = proxyUrl + sudoUrl + apiKey;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(res.status);
      }
      const data = await res.json();

      clearInterval(dots);    // clearing loading menu
      showNews(data);
    }

    // error handling
    catch (error) {
      clearInterval(dots);
      article_area.innerHTML = `<p class="load">An error occurred</p><p class="load">${error}</p>`;
    }
  };

  // getting search text
  const getSearch = (event) => {
    if (event.which === 13 || event.keyCode === 13 || event.key === "Enter") {
      if (search.value.trim()) {
        searchTxt = search.value.trim();
        fetchNews(searchTxt);
      }
    }
  };

  // changing theme
  const toggle_func = (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    else {
      document.documentElement.setAttribute('data-theme', 'default');
    }
  };

  // bind event
  toggleSwitch.addEventListener('change', toggle_func);
  search.addEventListener('keypress', getSearch);
  fetchNews();
});