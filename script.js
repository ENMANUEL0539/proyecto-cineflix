// API Configuration
const API_KEY = "536171ajgp4wibsih85mvo";
const BASE_URL = "https://doodapi.co/api";

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load movies on page load
    loadMovies();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up various event listeners
function setupEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Search functionality
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Handle scroll events for header
function handleScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Perform search using DoodStream API
async function performSearch() {
    const searchTerm = document.getElementById('search-input').value.trim();
    if (!searchTerm) return;
    
    try {
        const results = await searchVideos(searchTerm);
        renderMovies(results);
    } catch (error) {
        console.error('Error searching videos:', error);
        alert('Hubo un error al buscar películas. Por favor, intenta nuevamente.');
    }
}

// Get account information
async function getAccountInfo() {
    try {
        const response = await fetch(`${BASE_URL}/account/info?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.msg === "OK") {
            return data.resultado;
        } else {
            throw new Error(data.msg || "Error desconocido");
        }
    } catch (error) {
        console.error('Error getting account info:', error);
        throw error;
    }
}

// List files
async function listFiles(fld_id = "0") {
    try {
        const response = await fetch(`${BASE_URL}/file/list?key=${API_KEY}&fld_id=${fld_id}`);
        const data = await response.json();
        
        if (data.msg === "OK") {
            return data.resultado.files;
        } else {
            throw new Error(data.msg || "Error desconocido");
        }
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
}

// Search videos
async function searchVideos(term) {
    try {
        const response = await fetch(`${BASE_URL}/search/videos?key=${API_KEY}&search_term=${encodeURIComponent(term)}`);
        const data = await response.json();
        
        if (data.msg === "OK") {
            return data.resultado;
        } else {
            throw new Error(data.msg || "Error desconocido");
        }
    } catch (error) {
        console.error('Error searching videos:', error);
        throw error;
    }
}

// Upload video
async function uploadVideo(file) {
    try {
        // First get the upload server
        const serverResponse = await fetch(`${BASE_URL}/upload/server?key=${API_KEY}`);
        const serverData = await serverResponse.json();
        
        if (serverData.msg !== "OK") {
            throw new Error(serverData.msg || "Error obteniendo servidor de subida");
        }
        
        // Create FormData and append the file
        const formData = new FormData();
        formData.append('api_key', API_KEY);
        formData.append('file', file);
        
        // Post the file to the upload server
        const uploadResponse = await fetch(serverData.resultado + `?${API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        const uploadData = await uploadResponse.json();
        
        if (uploadData.msg === "OK") {
            return uploadData.resultado[0];
        } else {
            throw new Error(uploadData.msg || "Error subiendo el video");
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
}

// Render movies in the UI
function renderMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = '';
    
    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = '<p>No se encontraron películas.</p>';
        return;
    }
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        movieGrid.appendChild(card);
    });
}

// Create a movie card element
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    card.innerHTML = `
        <img src="${movie.single_img}" alt="${movie.title}" class="movie-image">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-genre">${movie.fld_id ? `Categoría: ${movie.fld_id}` : ''}</div>
            <div class="movie-rating">
                <span class="rating-stars">★★★★★</span>
                <span class="rating-value">${movie.canplay ? 'Disponible' : 'No disponible'}</span>
            </div>
            <p class="movie-description">${movie.uploaded ? `Subido: ${new Date(movie.uploaded).toLocaleDateString()}` : ''}</p>
            <a href="${movie.download_url}" class="watch-btn" target="_blank">Ver Ahora</a>
        </div>
    `;
    
    return card;
}

// Initial load of movies
async function loadMovies() {
    try {
        const movies = await listFiles();
        renderMovies(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
        // Fallback to sample data if API fails
        const sampleMovies = [
            {
                title: "La Vida es Bella",
                fld_id: "1654143",
                canplay: true,
                uploaded: "2025-09-01 20:30:22",
                single_img: "https://dsimgcdn.com/snaps/dyvwwnwcirliqbhv.jpg",
                download_url: "#"
            },
            {
                title: "Inception",
                fld_id: "1654143",
                canplay: true,
                uploaded: "2025-09-01 13:24:02",
                single_img: "https://dsimgcdn.com/snaps/c1tj50zsarx50kr9.jpg",
                download_url: "#"
            },
            {
                title: "Parásitos",
                fld_id: "1654143",
                canplay: true,
                uploaded: "2025-09-01 12:58:00",
                single_img: "https://dsimgcdn.com/snaps/75epk8blp10gaeq3.jpg",
                download_url: "#"
            },
            {
                title: "El Padrino",
                fld_id: "1654143",
                canplay: true,
                uploaded: "2025-09-01 12:30:43",
                single_img: "https://dsimgcdn.com/snaps/77capy3b1ln6a71f.jpg",
                download_url: "#"
            },
            {
                title: "Interstellar",
                fld_id: "1654143",
                canplay: true,
                uploaded: "2025-09-01 08:07:28",
                single_img: "https://dsimgcdn.com/snaps/erhkuqmvof1rtcwu.jpg",
                download_url: "#"
            }
        ];
        renderMovies(sampleMovies);
    }
}
