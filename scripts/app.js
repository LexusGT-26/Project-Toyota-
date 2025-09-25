const vehicles = [
  {
    id: 1,
    name: "Toyota Land Cruiser",
    year: 2024,
    status: "OK",
    mileage: 15000,
    lastService: "2025-06-10",
    engineType: "V8",
    fuelType: "Diesel",
    location: "Toyota Cubao",
    nextService: 5000,
    image: "images/Toyota Land Cruiser.jpg",
  },
  {
    id: 2,
    name: "Toyota Haice",
    year: 2025,
    status: "Alert",
    mileage: 32000,
    lastService: "2025-03-15",
    engineType: "Inline-4",
    fuelType: "Diesel",
    location: "Toyota Global City",
    nextService: 2000,
    image: "images/Toyota Haice.jpg",
  },
  {
    id: 3,
    name: "Toyota Hilux",
    year: 2023,
    status: "Critical",
    mileage: 50000,
    lastService: "2024-12-01",
    engineType: "2GD-FTV",
    fuelType: "Diesel",
    location: "Toyoata Manila Bay",
    nextService: 0,
    image:
      "https://www.toyota.com.au/-/media/toyota/vehicle/hilux/2023/gallery/hilux-gallery-01.jpg",
  },
  {
    id: 4,
    name: "Toyota Coaster",
    year: 2023,
    status: "Parts not available",
    mileage: 50000,
    lastService: "2024-12-01",
    engineType: "Inline-4",
    fuelType: "Diesel",
    location: "Manila, Philippines",
    nextService: 3000,
    image: "./images/Toyota Coaster.jpg",
  },
  {
    id: 5,
    name: "Toyota Fortuner",
    year: 2025,
    status: "Ready to realease",
    mileage: 45000,
    lastService: "2024-11-20",
    engineType: "Inline-4",
    fuelType: "Diesel",
    dealerlocation: "California, USA",
    nextService: 0,
    image: "images/Toyota Vios.jpg",
  },
  {
    id: 6,
    name: "Toyota Vios",
    year: 2023,
    status: "Critical",
    mileage: 45000,
    lastService: "2024-11-20",
    engineType: "Inline-4",
    fuelType: "Gasoline",
    location: "California, USA",
    nextService: 0,
    image: "images/Toyota Vios.jpg",
  },
  {
    id: 7,
    name: "Toyota Vios",
    year: 2023,
    status: "Critical",
    mileage: 45000,
    lastService: "2024-11-20",
    engineType: "Inline-4",
    fuelType: "Gasoline",
    location: "California, USA",
    nextService: 0,
    image: "images/Toyota Vios.jpg",
  },
  {
    id: 8,
    name: "Toyota Vios",
    year: 2023,
    status: "Critical",
    mileage: 45000,
    lastService: "2024-11-20",
    engineType: "Inline-4",
    fuelType: "Gasoline",
    location: "California, USA",
    nextService: 0,
    image: "images/Toyota Vios.jpg",
  },
];

function getStatusClass(status) {
  switch (status) {
    case "OK":
      return "status-ok";
    case "Alert":
      return "status-alert";
    case "Critical":
      return "status-critical";
    default:
      return "status-other";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "OK":
      return "fas fa-check-circle";
    case "Alert":
      return "fas fa-exclamation-triangle";
    case "Critical":
      return "fas fa-times-circle";
    default:
      return "fas fa-tools";
  }
}

function formatMileage(mileage) {
  return mileage.toLocaleString() + " km";
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function calculateServiceUrgency(nextService) {
  if (nextService <= 0) return "critical";
  if (nextService <= 1000) return "alert";
  return "ok";
}

function renderVehicles(vehiclesToRender = vehicles) {
  const container = document.getElementById("vehicle-list");
  container.innerHTML = "";

  if (vehiclesToRender.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No vehicles found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }

  vehiclesToRender.forEach((vehicle) => {
    const statusClass = getStatusClass(vehicle.status);
    const serviceUrgency = calculateServiceUrgency(vehicle.nextService);

    const card = document.createElement("div");
    card.className = `vehicle-card ${statusClass}`;
    card.innerHTML = `
      <div class="vehicle-img-container">
        <img src="${vehicle.image}" alt="${vehicle.name}" class="vehicle-img" 
             onerror="this.src='./images/Toyota Hilux.jpg'"/>
        <span class="status-badge">${vehicle.status}</span>
      </div>
      <div class="vehicle-card-content">
        <h2>${vehicle.name}</h2>
        <div class="vehicle-year">${vehicle.year} • ${vehicle.location}</div>
        
        <div class="vehicle-details">
          <div class="detail-item">
            <span class="detail-label">Mileage</span>
            <span class="detail-value">${formatMileage(vehicle.mileage)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Last Service</span>
            <span class="detail-value">${formatDate(vehicle.lastService)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Engine Type</span>
            <span class="detail-value">${vehicle.engineType}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fuel Type</span>
            <span class="detail-value">${vehicle.fuelType}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Next Service In</span>
            <span class="detail-value service-${serviceUrgency}">${
      vehicle.nextService
    } km</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Current Status</span>
            <span class="detail-value">
              <i class="${getStatusIcon(vehicle.status)}"></i>
              ${vehicle.status}
            </span>
          </div>
        </div>
        
        <div class="vehicle-actions">
          <button class="btn btn-primary" onclick="viewVehicleDetails(${
            vehicle.id
          })">
            <i class="fas fa-eye"></i> View Details
          </button>
          <button class="btn btn-secondary" onclick="scheduleService(${
            vehicle.id
          })">
            <i class="fas fa-calendar-alt"></i> Schedule
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterVehicles() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const statusFilter = document.getElementById("status-filter").value;
  const sortBy = document.getElementById("sort-by").value;

  let filtered = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm) ||
      vehicle.location.toLowerCase().includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort vehicles
  filtered.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "year") return b.year - a.year;
    if (sortBy === "status") return a.status.localeCompare(b.status);
    if (sortBy === "mileage") return b.mileage - a.mileage;
    return 0;
  });

  renderVehicles(filtered);
}

function viewVehicleDetails(vehicleId) {
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  alert(
    `Viewing details for: ${vehicle.name}\nStatus: ${vehicle.status}\nLocation: ${vehicle.location}`
  );
  // In a real application, this would open a modal or navigate to a details page
}

function scheduleService(vehicleId) {
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  alert(
    `Scheduling service for: ${vehicle.name}\nNext service due in: ${vehicle.nextService} km`
  );
  // In a real application, this would open a scheduling interface
}

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", function () {
  renderVehicles();

  // Add event listeners for filters
  document
    .getElementById("search-input")
    .addEventListener("input", filterVehicles);
  document
    .getElementById("status-filter")
    .addEventListener("change", filterVehicles);
  document.getElementById("sort-by").addEventListener("change", filterVehicles);

  // Update stats overview
  updateStatsOverview();
});

function updateStatsOverview() {
  const stats = {
    ok: vehicles.filter((v) => v.status === "OK").length,
    alert: vehicles.filter((v) => v.status === "Alert").length,
    critical: vehicles.filter((v) => v.status === "Critical").length,
    other: vehicles.filter(
      (v) => !["OK", "Alert", "Critical"].includes(v.status)
    ).length,
  };

  document.querySelector(".stat-card:nth-child(1) .stat-number").textContent =
    stats.ok;
  document.querySelector(".stat-card:nth-child(2) .stat-number").textContent =
    stats.alert;
  document.querySelector(".stat-card:nth-child(3) .stat-number").textContent =
    stats.critical;
  document.querySelector(".stat-card:nth-child(4) .stat-number").textContent =
    stats.other;
}

// Add CSS for service urgency
const style = document.createElement("style");
style.textContent = `
  .service-critical { color: var(--status-critical); font-weight: bold; }
  .service-alert { color: var(--status-alert); font-weight: bold; }
  .service-ok { color: var(--status-ok); }
  
  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: var(--text-light);
  }
  
  .no-results i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;
document.head.appendChild(style);
