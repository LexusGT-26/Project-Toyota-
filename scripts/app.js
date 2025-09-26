// Global data storage
let vehiclesData = [];
let dashboardData = {};
let maintenanceData = {};
let reportsData = {};
let settingsData = {};

// DOM Elements
const pages = {
  dashboard: document.getElementById("dashboard-page"),
  vehicles: document.getElementById("vehicles-page"),
  maintenance: document.getElementById("maintenance-page"),
  reports: document.getElementById("reports-page"),
  settings: document.getElementById("settings-page"),
};

// Navigation functions
function showPage(pageId) {
  // Hide all pages
  Object.values(pages).forEach((page) => {
    page.classList.remove("active");
  });

  // Show selected page
  if (pages[pageId]) {
    pages[pageId].classList.add("active");
  }

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  document.querySelector(`[data-page="${pageId}"]`).classList.add("active");

  // Load page-specific data
  loadPageData(pageId);
}

function loadPageData(pageId) {
  switch (pageId) {
    case "dashboard":
      loadDashboardData();
      break;
    case "vehicles":
      loadVehiclesData();
      break;
    case "maintenance":
      loadMaintenanceData();
      break;
    case "reports":
      loadReportsData();
      break;
    case "settings":
      loadSettingsData();
      break;
  }
}

// Data loading functions
async function loadAllData() {
  try {
    // Load vehicles data
    const vehiclesResponse = await fetch("./data/vehicles.json");
    const vehiclesJson = await vehiclesResponse.json();
    vehiclesData = vehiclesJson.vehicles || [];

    // Load dashboard data
    const dashboardResponse = await fetch("./data/dashboard.json");
    dashboardData = await dashboardResponse.json();

    // Load maintenance data
    const maintenanceResponse = await fetch("./data/maintenance.json");
    maintenanceData = await maintenanceResponse.json();

    // Load reports data
    const reportsResponse = await fetch("./data/reports.json");
    reportsData = await reportsResponse.json();

    // Load settings data
    const settingsResponse = await fetch("./data/settings.json");
    settingsData = await settingsResponse.json();

    console.log("All data loaded successfully");

    // Initialize the current page
    const currentPage = document
      .querySelector(".page.active")
      .id.replace("-page", "");
    loadPageData(currentPage);
  } catch (error) {
    console.error("Error loading data:", error);
    // Fallback to sample data if files don't exist
    loadSampleData();
  }
}

function loadSampleData() {
  // Sample vehicles data
  vehiclesData = [
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
  ];

  // Initialize with sample data
  const currentPage = document
    .querySelector(".page.active")
    .id.replace("-page", "");
  loadPageData(currentPage);
}

// Page-specific rendering functions
function loadDashboardData() {
  if (!dashboardData.overview) return;

  // Update overview stats
  document.getElementById("total-vehicles").textContent =
    dashboardData.overview.totalVehicles || 0;
  document.getElementById("active-vehicles").textContent =
    dashboardData.overview.activeVehicles || 0;
  document.getElementById("maintenance-vehicles").textContent =
    dashboardData.overview.inMaintenance || 0;
  document.getElementById("utilization-rate").textContent =
    (dashboardData.overview.utilizationRate || 0) + "%";
  document.getElementById("total-mileage").textContent = (
    dashboardData.overview.totalMileage || 0
  ).toLocaleString();
  document.getElementById("fuel-consumption").textContent = (
    dashboardData.overview.fuelConsumption || 0
  ).toLocaleString();
  document.getElementById("co2-saved").textContent = (
    dashboardData.overview.co2Saved || 0
  ).toLocaleString();

  // Render recent activity
  renderRecentActivity();

  // Render alerts
  renderAlerts();
}

function renderRecentActivity() {
  const container = document.getElementById("recent-activity-list");
  if (!dashboardData.recentActivity || !container) return;

  container.innerHTML = dashboardData.recentActivity
    .map(
      (activity) => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.vehicle} - ${
        activity.type
      }</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-date">${formatDate(activity.date)}</div>
            </div>
        </div>
    `
    )
    .join("");
}

function renderAlerts() {
  const container = document.getElementById("alerts-list");
  if (!dashboardData.alerts || !container) return;

  container.innerHTML = dashboardData.alerts
    .map(
      (alert) => `
        <div class="alert-item ${alert.priority}">
            <div class="alert-header">
                <div class="alert-title">
                    <i class="fas fa-exclamation-circle"></i>
                    ${alert.type} Alert
                </div>
                <span class="alert-priority ${alert.priority}">${
        alert.priority
      }</span>
            </div>
            <div class="alert-message">
                <strong>${alert.vehicle}:</strong> ${alert.message}
            </div>
            <div class="alert-date">${formatDateTime(alert.timestamp)}</div>
        </div>
    `
    )
    .join("");
}

function loadVehiclesData() {
  renderVehicles(vehiclesData);
  setupVehicleFilters();
}

function renderVehicles(vehiclesToRender = vehiclesData) {
  const container = document.getElementById("vehicle-list");
  if (!container) return;

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
                <img src="${vehicle.image}" alt="${
      vehicle.name
    }" class="vehicle-img" 
                     onerror="this.src='https://via.placeholder.com/350x200/1a1a1a/ffffff?text=${encodeURIComponent(
                       vehicle.name
                     )}'"/>
                <span class="status-badge">${vehicle.status}</span>
            </div>
            <div class="vehicle-card-content">
                <h2>${vehicle.name}</h2>
                <div class="vehicle-year">${vehicle.year} • ${
      vehicle.location
    }</div>
                
                <div class="vehicle-details">
                    <div class="detail-item">
                        <span class="detail-label">Mileage</span>
                        <span class="detail-value">${formatMileage(
                          vehicle.mileage
                        )}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Service</span>
                        <span class="detail-value">${formatDate(
                          vehicle.lastService
                        )}</span>
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

function setupVehicleFilters() {
  const searchInput = document.getElementById("vehicle-search");
  const statusFilter = document.getElementById("vehicle-status-filter");
  const sortSelect = document.getElementById("vehicle-sort");

  if (searchInput) {
    searchInput.addEventListener("input", filterVehicles);
  }
  if (statusFilter) {
    statusFilter.addEventListener("change", filterVehicles);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", filterVehicles);
  }
}

function filterVehicles() {
  const searchTerm =
    document.getElementById("vehicle-search")?.value.toLowerCase() || "";
  const statusFilter =
    document.getElementById("vehicle-status-filter")?.value || "all";
  const sortBy = document.getElementById("vehicle-sort")?.value || "name";

  let filtered = vehiclesData.filter((vehicle) => {
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

function loadMaintenanceData() {
  renderMaintenanceTabs();
  setupMaintenanceTabs();
}

function renderMaintenanceTabs() {
  // Render scheduled maintenance
  const scheduledContainer = document.getElementById("scheduled-maintenance");
  if (scheduledContainer && maintenanceData.scheduled) {
    scheduledContainer.innerHTML = maintenanceData.scheduled
      .map(
        (item) => `
            <div class="maintenance-item">
                <div class="maintenance-header">
                    <div class="maintenance-title">${item.vehicleName} - ${
          item.type
        }</div>
                    <span class="maintenance-status ${item.status}">${
          item.status
        }</span>
                </div>
                <div class="maintenance-details">
                    <p><strong>Scheduled:</strong> ${formatDate(
                      item.scheduledDate
                    )}</p>
                    <p><strong>Due:</strong> ${formatDate(item.dueDate)}</p>
                    <p><strong>Estimated Cost:</strong> ₱${item.estimatedCost?.toLocaleString()}</p>
                    <p><strong>Service Items:</strong> ${item.serviceItems?.join(
                      ", "
                    )}</p>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Render maintenance history
  const historyContainer = document.getElementById("maintenance-history");
  if (historyContainer && maintenanceData.history) {
    historyContainer.innerHTML = maintenanceData.history
      .map(
        (item) => `
            <div class="maintenance-item">
                <div class="maintenance-header">
                    <div class="maintenance-title">${item.vehicleName} - ${
          item.type
        }</div>
                    <span class="maintenance-status completed">Completed</span>
                </div>
                <div class="maintenance-details">
                    <p><strong>Completed:</strong> ${formatDate(
                      item.completedDate
                    )}</p>
                    <p><strong>Cost:</strong> ₱${item.cost?.toLocaleString()}</p>
                    <p><strong>Technician:</strong> ${item.technician}</p>
                    <p><strong>Details:</strong> ${item.details}</p>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Render service types
  const typesContainer = document.getElementById("service-types");
  if (typesContainer && maintenanceData.serviceTypes) {
    typesContainer.innerHTML = maintenanceData.serviceTypes
      .map(
        (type) => `
            <div class="maintenance-item">
                <div class="maintenance-header">
                    <div class="maintenance-title">${type.name}</div>
                    <span class="maintenance-status">Every ${type.interval?.toLocaleString()} km</span>
                </div>
            </div>
        `
      )
      .join("");
  }
}

function setupMaintenanceTabs() {
  const tabBtns = document.querySelectorAll(".maintenance-tabs .tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      // Update active tab button
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show corresponding tab content
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
}

function loadReportsData() {
  renderReports();
  setupReportControls();
}

function renderReports() {
  // This would render different report types based on selection
  console.log("Rendering reports...");
}

function setupReportControls() {
  const generateBtn = document.getElementById("generate-report");
  if (generateBtn) {
    generateBtn.addEventListener("click", generateReport);
  }
}

function generateReport() {
  alert("Report generation functionality would be implemented here!");
}

function loadSettingsData() {
  renderSettingsTabs();
  setupSettingsTabs();
}

function renderSettingsTabs() {
  // This would render settings forms
  console.log("Rendering settings...");
}

function setupSettingsTabs() {
  const tabBtns = document.querySelectorAll(".settings-tabs .tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      // Update active tab button
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show corresponding tab content
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
}

// Utility functions
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

function getActivityIcon(activityType) {
  switch (activityType.toLowerCase()) {
    case "service completed":
      return "wrench";
    case "inspection required":
      return "search";
    case "parts replaced":
      return "cog";
    default:
      return "info-circle";
  }
}

function formatMileage(mileage) {
  return mileage.toLocaleString() + " km";
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "N/A";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateTimeString).toLocaleDateString("en-US", options);
}

function calculateServiceUrgency(nextService) {
  if (nextService <= 0) return "critical";
  if (nextService <= 1000) return "alert";
  return "ok";
}

// Modal functions
function viewVehicleDetails(vehicleId) {
  const vehicle = vehiclesData.find((v) => v.id === vehicleId);
  if (!vehicle) return;

  const modal = document.getElementById("vehicle-modal");
  const modalContent = document.getElementById("vehicle-modal-content");

  modalContent.innerHTML = `
        <h2>${vehicle.name}</h2>
        <div class="vehicle-details-modal">
            <div class="detail-row">
                <span class="detail-label">Year:</span>
                <span class="detail-value">${vehicle.year}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value ${getStatusClass(vehicle.status)}">${
    vehicle.status
  }</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Mileage:</span>
                <span class="detail-value">${formatMileage(
                  vehicle.mileage
                )}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${vehicle.location}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Last Service:</span>
                <span class="detail-value">${formatDate(
                  vehicle.lastService
                )}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Next Service:</span>
                <span class="detail-value">${vehicle.nextService} km</span>
            </div>
        </div>
    `;

  modal.style.display = "block";
}

function scheduleService(vehicleId) {
  const vehicle = vehiclesData.find((v) => v.id === vehicleId);
  alert(
    `Scheduling service for: ${vehicle.name}\nNext service due in: ${vehicle.nextService} km`
  );
}

// Close modal when clicking X
document.querySelector(".close")?.addEventListener("click", function () {
  document.getElementById("vehicle-modal").style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const modal = document.getElementById("vehicle-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Set up navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageId = this.getAttribute("data-page");
      showPage(pageId);
    });
  });

  // Set up Add Vehicle button
  document
    .getElementById("add-vehicle-btn")
    ?.addEventListener("click", function () {
      alert("Add Vehicle functionality would be implemented here!");
    });

  // Load all data
  loadAllData();

  // Add CSS for modal details
  const style = document.createElement("style");
  style.textContent = `
        .vehicle-details-modal {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }
        .detail-row:last-child {
            border-bottom: none;
        }
    `;
  document.head.appendChild(style);
});
