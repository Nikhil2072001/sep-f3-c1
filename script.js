document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("apiKey");
    const movieTitleInput = document.getElementById("movieTitle");
    const searchButton = document.getElementById("searchButton");
    const loader = document.querySelector(".loader");
    const error = document.querySelector(".error");
    const resultsContainer = document.querySelector(".results");

    searchButton.addEventListener("click", () => {
        const apiKey = apiKeyInput.value.trim();
        const movieTitle = movieTitleInput.value.trim();

        // Check if both fields are filled
        if (!apiKey || !movieTitle) {
            error.textContent = "Both fields are required.";
            error.style.display = "block";
            resultsContainer.innerHTML = "";
            return;
        }

        // Clear any previous error messages
        error.textContent = "";
        error.style.display = "none";

        // Display loader while fetching data
        loader.style.display = "block";

        // Make API request
        fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                // Hide loader
                loader.style.display = "none";

                if (data.Error) {
                    // Handle API error
                    error.textContent = data.Error;
                    error.style.display = "block";
                    resultsContainer.innerHTML = "";
                } else if (data.Search) {
                    // Display movie results
                    const movies = data.Search;
                    resultsContainer.innerHTML = "";

                    movies.forEach(movie => {
                        const movieCard = document.createElement("div");
                        movieCard.classList.add("movie-card");
                        movieCard.innerHTML = `
                            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.png'}" alt="${movie.Title}">
                            <h2>${movie.Title}</h2>
                            <p>${movie.Year}</p>
                            <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">More Details</a>
                        `;
                        resultsContainer.appendChild(movieCard);
                    });
                }
            })
            .catch(error => {
                // Handle fetch error
                loader.style.display = "none";
                error.textContent = "An error occurred while fetching data.";
                error.style.display = "block";
                resultsContainer.innerHTML = "";
            });
    });
});
