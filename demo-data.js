// ==================== DEMO REPORTS DATA ====================
const demoReports = [
    {
        lat: 40.7138,
        lng: -74.0070,
        type: 'Poor Lighting',
        severity: 'high',
        description: 'Street lights not working for 2 weeks',
        time: '2 hours ago',
        reports: 5
    },
    {
        lat: 40.7118,
        lng: -74.0050,
        type: 'Suspicious Activity',
        severity: 'medium',
        description: 'People loitering at night',
        time: '1 day ago',
        reports: 3
    },
    {
        lat: 40.7148,
        lng: -74.0080,
        type: 'Harassment',
        severity: 'high',
        description: 'Multiple incidents reported',
        time: '5 days ago',
        reports: 8
    },
    {
        lat: 40.7158,
        lng: -74.0090,
        type: 'Unsafe Condition',
        severity: 'low',
        description: 'Broken sidewalk, poor visibility',
        time: '3 days ago',
        reports: 2
    },
    {
        lat: 40.7120,
        lng: -74.0065,
        type: 'Crime Report',
        severity: 'high',
        description: 'Police involved incident',
        time: '1 week ago',
        reports: 12
    }
];

// ==================== SAFE ZONES DATA ====================
const safeZones = [
    {
        lat: 40.7150,
        lng: -74.0090,
        name: 'Police Station',
        type: 'police'
    },
    {
        lat: 40.7100,
        lng: -74.0030,
        name: 'City Hospital',
        type: 'hospital'
    },
    {
        lat: 40.7130,
        lng: -74.0040,
        name: '24/7 Convenience Store',
        type: 'store'
    },
    {
        lat: 40.7160,
        lng: -74.0100,
        name: 'Subway Station',
        type: 'transit'
    },
    {
        lat: 40.7090,
        lng: -74.0020,
        name: 'Coffee Shop (Open Late)',
        type: 'cafe'
    }
];

// ==================== SAFETY SCORES DATA ====================
const safetyScores = {
    current: 85,
    day: 92,
    night: 45,
    morning: 88,
    afternoon: 90,
    evening: 72
};

// ==================== ROUTE DATA ====================
const routeData = {
    fastest: {
        time: '8 min',
        distance: '0.8 miles',
        safety: 35,
        features: [
            'Dark alley',
            'No CCTV',
            '3 incidents'
        ]
    },
    safest: {
        time: '10 min',
        distance: '1.1 miles',
        safety: 92,
        features: [
            'Well-lit streets',
            'CCTV covered',
            '0 incidents'
        ]
    }
};

// ==================== USER STATS ====================
const userStats = {
    safetyScore: 85,
    reportsMade: 12,
    routesTaken: 47,
    sosActivated: 0,
    trustedContacts: ['Mom', 'Dad', 'Roommate']
};

// ==================== NOTIFICATION MESSAGES ====================
const notifications = {
    heatmapOn: 'Heatmap enabled - Red areas indicate danger',
    heatmapOff: 'Heatmap disabled',
    reportSubmitted: 'Report submitted! Thank you for keeping the community safe.',
    sosSent: '🚨 SOS ALERT SENT! Emergency contacts notified.',
    locationSharingOn: 'Live location sharing started',
    locationSharingOff: 'Live location sharing stopped',
    safeRouteSelected: '🛡️ Safe route selected! Follow the green path.',
    dangerAlert: '⚠️ Danger Zone Ahead! You\'re approaching an area with 3 recent incidents'
};