// ==================== GLOBAL VARIABLES ====================
let map;
let userMarker;
let heatmapLayer = null;
let currentLat = 40.7128;
let currentLng = -74.0060;
let sosTimer;
let sosCountdown = 3;
let currentRoute = null;

// Google Maps style tile layer
const googleMapStyle = {
    tileSize: 256,
    attribution: '© OpenStreetMap',
    subdomains: 'abc'
};

// Demo Data
const places = [
    { name: 'Home', icon: 'fa-home', lat: 40.7128, lng: -74.0060 },
    { name: 'Work', icon: 'fa-briefcase', lat: 40.7138, lng: -74.0070 },
    { name: 'Gym', icon: 'fa-dumbbell', lat: 40.7118, lng: -74.0050 },
    { name: 'Cafe', icon: 'fa-coffee', lat: 40.7148, lng: -74.0080 },
    { name: 'Park', icon: 'fa-tree', lat: 40.7158, lng: -74.0090 },
    { name: 'Store', icon: 'fa-store', lat: 40.7120, lng: -74.0065 },
    { name: 'Bank', icon: 'fa-university', lat: 40.7135, lng: -74.0075 },
    { name: 'Pharmacy', icon: 'fa-prescription', lat: 40.7140, lng: -74.0085 }
];

const reports = [
    { type: 'Poor Lighting', severity: 'high', location: 'Main St & 5th Ave', time: '2 hours ago', lat: 40.7138, lng: -74.0070 },
    { type: 'Suspicious Activity', severity: 'medium', location: 'Central Park', time: '1 day ago', lat: 40.7118, lng: -74.0050 },
    { type: 'Harassment', severity: 'high', location: 'Times Square', time: '5 hours ago', lat: 40.7148, lng: -74.0080 },
    { type: 'Unsafe Condition', severity: 'low', location: 'Broadway', time: '3 days ago', lat: 40.7158, lng: -74.0090 },
    { type: 'Accident', severity: 'medium', location: '5th Avenue', time: '1 hour ago', lat: 40.7120, lng: -74.0065 }
];

const exploreItems = [
    { name: 'Police', icon: 'fa-shield-alt', count: 3 },
    { name: 'Hospitals', icon: 'fa-hospital', count: 2 },
    { name: 'Stores', icon: 'fa-store', count: 8 },
    { name: 'Restaurants', icon: 'fa-utensils', count: 15 },
    { name: 'Gas', icon: 'fa-gas-pump', count: 4 },
    { name: 'Parks', icon: 'fa-tree', count: 6 }
];

const contacts = [
    { name: 'Mom', status: 'online' },
    { name: 'Dad', status: 'online' },
    { name: 'Alex', status: 'offline' }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadPlaces();
    loadReports();
    loadExploreGrid();
    loadReportsList();
    loadContacts();
    setupEventListeners();
    
    // Show safety card after 2 seconds
    setTimeout(() => {
        document.getElementById('safetyCard').classList.add('show');
    }, 2000);
    
    // Show danger alert after 4 seconds
    setTimeout(() => {
        document.getElementById('dangerAlert').classList.add('show');
    }, 4000);
});

// ==================== MAP FUNCTIONS ====================
function initMap() {
    // Initialize map with Google-like styling
    map = L.map('map', {
        center: [currentLat, currentLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
    });

    // Google Maps style tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Add user marker (Google Maps style)
    userMarker = L.marker([currentLat, currentLng], {
        icon: L.divIcon({
            className: 'user-marker',
            html: '<div style="background-color: #4285F4; width: 16px; height: 16px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
            iconSize: [22, 22]
        })
    }).addTo(map).bindPopup('You are here');

    // Add report markers
    reports.forEach(report => {
        let color = report.severity === 'high' ? '#ea4335' : 
                   report.severity === 'medium' ? '#fbbc04' : '#34a853';
        
        L.marker([report.lat, report.lng], {
            icon: L.divIcon({
                className: 'report-marker',
                html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
                iconSize: [16, 16]
            })
        }).addTo(map).bindPopup(`<b>${report.type}</b><br>${report.time}`);
    });

    // Add place markers
    places.forEach(place => {
        L.marker([place.lat, place.lng], {
            icon: L.divIcon({
                className: 'place-marker',
                html: `<div style="background-color: #1a73e8; width: 10px; height: 10px; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
                iconSize: [14, 14]
            })
        }).addTo(map).bindPopup(place.name);
    });
}

// ==================== LOAD DATA FUNCTIONS ====================
function loadPlaces() {
    const grid = document.getElementById('placesGrid');
    grid.innerHTML = '';
    
    places.slice(0, 8).forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <i class="fas ${place.icon}"></i>
            <span>${place.name}</span>
        `;
        card.onclick = () => {
            map.flyTo([place.lat, place.lng], 17);
            showNotification(`📍 ${place.name} selected`);
        };
        grid.appendChild(card);
    });
}

function loadReports() {
    const container = document.getElementById('reportsHorizontal');
    container.innerHTML = '';
    
    reports.slice(0, 5).forEach(report => {
        const card = document.createElement('div');
        card.className = `report-mini-card ${report.severity}`;
        card.innerHTML = `
            <strong>${report.type}</strong>
            <span>${report.location}</span>
            <span>${report.time}</span>
        `;
        card.onclick = () => {
            map.flyTo([report.lat, report.lng], 18);
            showNotification(`📍 Showing: ${report.location}`);
        };
        container.appendChild(card);
    });
}

function loadExploreGrid() {
    const grid = document.getElementById('exploreGrid');
    grid.innerHTML = '';
    
    exploreItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'explore-item';
        card.innerHTML = `
            <i class="fas ${item.icon}"></i>
            <span>${item.name}</span>
            <small>${item.count} nearby</small>
        `;
        card.onclick = () => {
            showNotification(`Showing ${item.name} near you`);
            closeModal('exploreModal');
        };
        grid.appendChild(card);
    });
}

function loadReportsList() {
    const list = document.getElementById('reportsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    reports.forEach(report => {
        const div = document.createElement('div');
        div.className = `report-card ${report.severity}`;
        div.innerHTML = `
            <strong>${report.type}</strong>
            <p style="font-size: 12px; margin: 4px 0;">${report.location}</p>
            <small style="color: #5f6368;">${report.time}</small>
        `;
        div.onclick = () => {
            map.flyTo([report.lat, report.lng], 18);
            closeModal('reportsModal');
        };
        list.appendChild(div);
    });
}

function loadContacts() {
    const list = document.getElementById('contactsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    contacts.forEach(contact => {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.innerHTML = `
            <i class="fas fa-user"></i>
            <div class="contact-info">
                <strong>${contact.name}</strong>
                <small>Emergency Contact</small>
            </div>
            <div class="contact-status ${contact.status === 'online' ? '' : 'offline'}"></div>
        `;
        list.appendChild(div);
    });
}

// ==================== MAP CONTROL FUNCTIONS ====================
function goToCurrentLocation() {
    map.flyTo([currentLat, currentLng], 17);
    showNotification('📍 Showing your location');
}

function zoomIn() {
    map.setZoom(map.getZoom() + 1);
}

function zoomOut() {
    map.setZoom(map.getZoom() - 1);
}

function toggleLayers() {
    showNotification('🗺️ Satellite view coming soon!');
}

// ==================== HEATMAP FUNCTIONS ====================
function toggleHeatmap() {
    if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
        heatmapLayer = null;
        showNotification('Heatmap disabled');
    } else {
        heatmapLayer = L.layerGroup().addTo(map);
        
        reports.forEach(report => {
            let color = report.severity === 'high' ? '#ea4335' :
                       report.severity === 'medium' ? '#fbbc04' : '#34a853';
            let weight = report.severity === 'high' ? 1 : 
                        report.severity === 'medium' ? 0.7 : 0.4;
            
            for (let i = 0; i < 8; i++) {
                L.circleMarker([
                    report.lat + (Math.random() - 0.5) * 0.003,
                    report.lng + (Math.random() - 0.5) * 0.003
                ], {
                    radius: 12 + (weight * 8),
                    color: 'transparent',
                    fillColor: color,
                    fillOpacity: 0.2,
                    weight: 0
                }).addTo(heatmapLayer);
            }
        });
        
        showNotification('🔥 Heatmap enabled');
    }
}

// ==================== SEARCH FUNCTIONS ====================
function openSearch() {
    openModal('searchModal');
    loadRecentSearches();
}

function loadRecentSearches() {
    const recentList = document.getElementById('recentList');
    const recent = ['Home', 'Work', 'Gym', 'Starbucks', 'Central Park'];
    
    recentList.innerHTML = '';
    recent.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `<i class="fas fa-history"></i> ${item}`;
        div.onclick = () => {
            document.getElementById('searchInput').value = item;
            showNotification(`Searching for ${item}...`);
        };
        recentList.appendChild(div);
    });
}

// ==================== REPORT FUNCTIONS ====================
function submitReport() {
    const type = document.getElementById('incidentType').value;
    const severity = document.querySelector('input[name="severity"]:checked').value;
    const desc = document.getElementById('reportDesc').value || 'No description';
    
    showNotification(`✅ Report submitted: ${type} (${severity})`);
    closeModal('reportModal');
    document.getElementById('reportDesc').value = '';
}

// ==================== ROUTE FUNCTIONS ====================
function showRouteOptions() {
    openModal('routeModal');
}

function startRoute() {
    showNotification('🛡️ Starting safe route navigation...');
    closeModal('routeModal');
    
    if (currentRoute) {
        map.removeLayer(currentRoute);
    }
    
    currentRoute = L.polyline([
        [currentLat, currentLng],
        [currentLat + 0.002, currentLng + 0.002],
        [currentLat + 0.004, currentLng + 0.003],
        [currentLat + 0.005, currentLng + 0.003]
    ], { 
        color: '#34a853', 
        weight: 6,
        opacity: 0.8,
        lineCap: 'round'
    }).addTo(map);
}

function findSafeRoute() {
    document.getElementById('dangerAlert').classList.remove('show');
    showRouteOptions();
}

// ==================== SOS FUNCTIONS ====================
function triggerSOS() {
    openModal('sosModal');
    startSOSTimer();
}

function startSOSTimer() {
    const timerEl = document.getElementById('sosTimer');
    sosCountdown = 3;
    timerEl.textContent = sosCountdown;
    
    if (sosTimer) clearInterval(sosTimer);
    
    sosTimer = setInterval(() => {
        sosCountdown--;
        timerEl.textContent = sosCountdown;
        
        if (sosCountdown === 0) {
            clearInterval(sosTimer);
            sendSOS();
        }
    }, 1000);
}

function sendSOS() {
    clearInterval(sosTimer);
    closeModal('sosModal');
    showNotification('🚨 SOS ALERT SENT! Emergency contacts notified', 'emergency');
    
    // Flash effect
    document.body.style.backgroundColor = '#ea4335';
    setTimeout(() => {
        document.body.style.backgroundColor = '';
    }, 500);
}

function cancelSOS() {
    clearInterval(sosTimer);
    closeModal('sosModal');
}

// ==================== MODAL FUNCTIONS ====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// ==================== NOTIFICATION ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// ==================== TAB NAVIGATION ====================
function switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    switch(tabId) {
        case 'mapTab':
            map.flyTo([currentLat, currentLng], 15);
            showNotification('📍 Map view');
            break;
        case 'exploreTab':
            openModal('exploreModal');
            break;
        case 'reportsTab':
            openModal('reportsModal');
            loadReportsList();
            break;
        case 'profileTab':
            openModal('profileModal');
            break;
    }
}

// ==================== SETTINGS ====================
function toggleDarkMode() {
    const isChecked = document.getElementById('darkMode').checked;
    if (isChecked) {
        document.querySelector('.app').style.background = '#202124';
        document.querySelector('.app').style.color = 'white';
        showNotification('🌙 Dark mode enabled');
    } else {
        document.querySelector('.app').style.background = 'white';
        document.querySelector('.app').style.color = '#202124';
        showNotification('☀️ Light mode enabled');
    }
}

function logout() {
    if (confirm('Sign out of SafeRoute?')) {
        showNotification('👋 See you soon!');
        setTimeout(() => {
            closeModal('profileModal');
        }, 1500);
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Header buttons
    document.getElementById('menuBtn').addEventListener('click', () => {
        showNotification('Menu coming soon!');
    });
    
    document.getElementById('notifBtn').addEventListener('click', () => {
        showNotification('🔔 3 new notifications');
    });
    
    document.getElementById('profileBtn').addEventListener('click', () => {
        openModal('profileModal');
    });
    
    // Search
    document.getElementById('searchBox').addEventListener('click', openSearch);
    document.getElementById('closeSearchBtn').addEventListener('click', () => closeModal('searchModal'));
    document.getElementById('voiceBtn').addEventListener('click', () => {
        showNotification('🎤 Voice search coming soon!');
    });
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', function(e) {
        if (e.target.value.length > 2) {
            showNotification(`Searching for "${e.target.value}"...`);
        }
    });
    
    // Map controls
    document.getElementById('currentLocationBtn').addEventListener('click', goToCurrentLocation);
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
    document.getElementById('layersBtn').addEventListener('click', toggleLayers);
    
    // Quick actions
    document.getElementById('heatmapBtn').addEventListener('click', toggleHeatmap);
    document.getElementById('reportBtn').addEventListener('click', () => openModal('reportModal'));
    document.getElementById('routeBtn').addEventListener('click', showRouteOptions);
    document.getElementById('sosBtn').addEventListener('click', triggerSOS);
    
    // Live traffic
    document.getElementById('liveTraffic').addEventListener('click', () => {
        showNotification('🚦 Live traffic enabled');
    });
    
    // Danger alert
    document.getElementById('findSafeRouteBtn').addEventListener('click', findSafeRoute);
    
    // View all buttons
    document.getElementById('viewAllPlaces').addEventListener('click', () => {
        showNotification('Showing all places');
    });
    
    document.getElementById('viewAllReports').addEventListener('click', () => {
        openModal('reportsModal');
    });
    
    // Explore modal
    document.getElementById('closeExploreBtn').addEventListener('click', () => closeModal('exploreModal'));
    
    // Category buttons
    document.getElementById('catAll').addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        loadExploreGrid();
    });
    
    document.getElementById('catPolice').addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showNotification('Showing police stations');
    });
    
    document.getElementById('catHospital').addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showNotification('Showing hospitals');
    });
    
    document.getElementById('catStore').addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showNotification('Showing stores');
    });
    
    document.getElementById('catFood').addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showNotification('Showing restaurants');
    });
    
    // Reports modal
    document.getElementById('closeReportsBtn').addEventListener('click', () => closeModal('reportsModal'));
    
    // Report modal
    document.getElementById('closeReportBtn').addEventListener('click', () => closeModal('reportModal'));
    document.getElementById('submitReportBtn').addEventListener('click', submitReport);
    
    // Route modal
    document.getElementById('closeRouteBtn').addEventListener('click', () => closeModal('routeModal'));
    
    document.getElementById('fastestTab').addEventListener('click', function() {
        document.querySelectorAll('.route-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        showNotification('Showing fastest route');
    });
    
    document.getElementById('safestTab').addEventListener('click', function() {
        document.querySelectorAll('.route-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        showNotification('Showing safest route');
    });
    
    document.getElementById('startRouteBtn').addEventListener('click', startRoute);
    
    // Profile modal
    document.getElementById('closeProfileBtn').addEventListener('click', () => closeModal('profileModal'));
    document.getElementById('darkMode').addEventListener('change', toggleDarkMode);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // SOS modal
    document.getElementById('cancelSosBtn').addEventListener('click', cancelSOS);
    document.getElementById('sendSosBtn').addEventListener('click', sendSOS);
    
    // Bottom navigation
    document.getElementById('mapTab').addEventListener('click', () => switchTab('mapTab'));
    document.getElementById('exploreTab').addEventListener('click', () => switchTab('exploreTab'));
    document.getElementById('reportsTab').addEventListener('click', () => switchTab('reportsTab'));
    document.getElementById('profileTab').addEventListener('click', () => switchTab('profileTab'));
    
    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
}