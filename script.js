const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const authorProfileThumbnail = document.getElementById(
  "author-profile-thumbnail"
);

let apiQuotes = [];

// Show Loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// Hide Loading
function complete() {
  quoteContainer.hidden = false;
  loader.hidden = true;
}

// Show New Quote
function newQuote() {
  loading();
  authorProfileThumbnail.classList.remove("show");
  // Pick a random quote from apiQuotes array
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
  //   console.log(quote);
  // Check if Author field is blank and replace it with 'Unknown'
  if (!quote.author) {
    authorText.textContent = "Unknown";
  } else {
    authorText.textContent = quote.author;
    // Get Author Information from Wikipedia
    getInformation(quote.author);
  }

  // Check Quote length to determine styling
  if (quote.text.length > 120) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }

  // Set Quote, Hide Loader
  quoteText.textContent = quote.text;
  complete();
}

const getInformation = async (author) => {
  loading();
  author = author.replaceAll(" ", "%20");
  const apiUrl = `http://en.wikipedia.org/w/api.php?action=query&titles=${author}&prop=pageimages|info&inprop=url&format=json&pithumbsize=100`;
  //const apiUrl = "http://localhost:3000/wiki"
  try {
    await fetch(apiUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: author,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        const data = result.query.pages;
        const pageIds = Object.keys(result);
        if (pageIds.length) {
          const pageId = pageIds[0];
          const data = result[pageId];
          const url = data.fullurl;
          authorText.href = url;
          const thumbnail = data.thumbnail;
          if (thumbnail) {
            const source = thumbnail.source;
            authorProfileThumbnail.src = source;
            authorProfileThumbnail.classList.add("show");
          } else {
            authorProfileThumbnail.classList.remove("show");
          }
        }
        complete();
      });
  } catch (error) {
    complete();
  }
};

// Get Quotes From API
async function getQuotes() {
  loading();
  const apiUrl = "https://type.fit/api/quotes";
  try {
    const response = await fetch(apiUrl);
    apiQuotes = await response.json();
    newQuote();
  } catch (error) {
    // Catch Error Here
  }
}

// Tweet Quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
  window.open(twitterUrl, "_blank");
}

// Event Listeners
newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);

//On Load
getQuotes();
