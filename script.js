const apiKey = '73c1ba69414fb2c820986bc5be3a4742';  // OpenWeatherMap API key
const city = 'Denver'; // City for weather info

// Function to fetch system information
function getSystemInfo() {
  const systemInfoElement = document.getElementById('system-info');
  let systemInfo = `
        <strong>Browser:</strong> ${navigator.userAgent}<br>
        <strong>Platform:</strong> ${navigator.platform}<br>
        <strong>Language:</strong> ${navigator.language}<br>
        <strong>Screen Resolution:</strong> ${window.screen.width} x ${window.screen.height}<br>
        <strong>Available Screen Space:</strong> ${window.innerWidth} x ${window.innerHeight}<br>
        <strong>CPU Cores:</strong> ${navigator.hardwareConcurrency || 'Not Available'}<br>
        <strong>RAM:</strong> ${navigator.deviceMemory || 'Not Available'} GB<br>
      `;

  // Add Operating System Info
  const os = getOS();
  systemInfo += `<strong>Operating System:</strong> ${os}<br>`;

  // Display system info before storage estimate
  systemInfoElement.innerHTML = systemInfo;

  // Fetch storage asynchronously
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(({ quota, usage }) => {
      systemInfoElement.innerHTML += `
            <strong>Storage:</strong> ${(usage / (1024 ** 3)).toFixed(2)} GB used of ${(quota / (1024 ** 3)).toFixed(2)} GB total<br>
          `;
    }).catch(() => {
      systemInfoElement.innerHTML += `<strong>Storage:</strong> Not Available<br>`;
    });
  } else {
    systemInfoElement.innerHTML += `<strong>Storage:</strong> Not Available<br>`;
  }
}

// Function to detect the operating system
function getOS() {
  const platform = navigator.platform.toLowerCase();
  if (platform.indexOf('win') !== -1) return 'Windows';
  if (platform.indexOf('mac') !== -1) return 'macOS';
  if (platform.indexOf('linux') !== -1) return 'Linux';
  return 'Unknown OS';
}

// Function to fetch weather information
async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const weatherInfoElement = document.getElementById('weather-info');

    if (data.cod === 200) {
      const { main, weather, wind } = data;
      weatherInfoElement.innerHTML = `
            <strong>City:</strong> ${city}<br>
            <strong>Temperature:</strong> ${main.temp}°F<br>
            <strong>Weather:</strong> ${weather[0].description}<br>
            <strong>Humidity:</strong> ${main.humidity}%<br>
            <strong>Wind Speed:</strong> ${wind.speed} m/s
          `;
    } else {
      weatherInfoElement.innerHTML = 'Failed to load weather data.';
    }
  } catch (error) {
    document.getElementById('weather-info').innerHTML = 'Failed to load weather data.';
  }
}

// Generic RSS Fetching Function
async function fetchRSSFeed(url, elementId) {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const rssFeedElement = document.getElementById(elementId);

    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const articles = data.items.slice(0, 5); // Limit to the first 5 items
      rssFeedElement.innerHTML = articles.map(article => `
            <li><a href="${article.link}" target="_blank">${article.title}</a></li>
          `).join('');
    } else {
      rssFeedElement.innerHTML = 'Failed to load feed or no items available.';
    }
  } catch (error) {
    document.getElementById(elementId).innerHTML = 'Failed to load feed.';
    console.error('RSS Fetch Error:', error); // Log to console for debugging
  }
}

// Fetching all data
getSystemInfo();
getWeather();
fetchRSSFeed('https://feeds.npr.org/1001/rss.xml', 'rss-feed');
fetchRSSFeed('https://techcrunch.com/feed/', 'rss-feed-tech');
fetchRSSFeed('https://www.wired.com/feed/', 'rss-feed-wired');
fetchRSSFeed('https://www.theverge.com/rss/index.xml', 'rss-feed-verge');

