// Global variable to store the current videos
let currentVideos = [];

// Function to fetch and display videos for a category
const fetchVideos = async (categoryId) => {
  const videosContainer = document.getElementById("videos");
  videosContainer.innerHTML = `<span class="loading loading-dots loading-xs"></span>
      <span class="loading loading-dots loading-sm"></span>
      <span class="loading loading-dots loading-md"></span>
      <span class="loading loading-dots loading-lg"></span>`;
  
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
    );
    const data = await response.json();
    
    if (data.status && data.data.length > 0) {
      currentVideos = data.data; // Store the fetched videos
      displayVideos(currentVideos);
    } else {
      videosContainer.innerHTML = "<p>No videos found for this category.</p>";
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    videosContainer.innerHTML =
      "<p>Error loading videos. Please try again.</p>";
  }
}

// Function to display videos
const displayVideos = (videos) => {
  const videosContainer = document.getElementById("videos");
  videosContainer.innerHTML = ""; // Clear container
  
  videos.forEach((video) => {
    const videoElement = document.createElement("div");
    videoElement.innerHTML = `
      <div class="card bg-base-100 shadow-xl">
        <figure>
          <img class='h-48'
            src="${video.thumbnail}"
            alt="${video.title}"
          />
        </figure>
        <div class="card-body">
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img src="${video.authors[0].profile_picture}" />
            </div>
          </div>
          <div>
            <h2 class="card-title">${video.title}</h2>
            <p>${video.authors[0].profile_name} <span class="font-semibold">${video.authors[0].verified === true ? "Verified" : ""}</span></p>
            <p>${video.others.views}</p>
          </div>
        </div>
      </div>
    `;
    videosContainer.appendChild(videoElement);
  });
}

// Function to handle tab clicks
function handleTabClick(event) {
  if (event.target.classList.contains("tab-action")) {
    // Remove active class from all tabs
    document
      .querySelectorAll(".tab-action")
      .forEach((tab) => tab.classList.remove("active"));
    
    // Add active class to clicked tab
    event.target.classList.add("active");
    
    // Fetch videos for the selected category
    const categoryId = event.target.getAttribute("data-category");
    fetchVideos(categoryId);
  }
}

// Function to sort videos by view
const sortVideosByView = () => {
  currentVideos.sort((a, b) => {
    const viewsA = parseInt(a.others.views.replace(/[K,]/g, '')) * (a.others.views.includes('K') ? 1000 : 1);
    const viewsB = parseInt(b.others.views.replace(/[K,]/g, '')) * (b.others.views.includes('K') ? 1000 : 1);
    return viewsB - viewsA; // Sort in descending order
  });
  displayVideos(currentVideos);
}

// Add click event listener to the tabs container
document.getElementById("tabs").addEventListener("click", handleTabClick);

// Add click event listener to the sort button
document.getElementById("sortByViewBtn").addEventListener("click", sortVideosByView);

// Fetch videos for the default (All) category when the page loads
document.addEventListener("DOMContentLoaded", () => fetchVideos("1000"));