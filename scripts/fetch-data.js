import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'https://act-kundal-backend.vercel.app/api';
const DATA_DIR = path.join(__dirname, '../src/data');

const endpoints = [
    { name: 'homepage', url: '/homepage' },
    { name: 'aboutpage', url: '/aboutpage' },
    { name: 'missionpage', url: '/missionpage' },
    { name: 'managementpage', url: '/managementpage' },
    { name: 'gallerypage', url: '/gallerypage' },
    { name: 'servicepage', url: '/servicepage' },
    { name: 'projectpage', url: '/projectpage' },
    { name: 'resourcespage', url: '/resourcespage' },
    { name: 'workforcepage', url: '/workforcepage' },
    { name: 'layout', url: '/layout' },
    { name: 'ehspage', url: '/ehspage' },
    { name: 'certificatepage', url: '/certificatepage' },
    { name: 'contactpage', url: '/contactpage' },
    { name: 'careerpage', url: '/careerpage' }
];

async function fetchData() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    /*
     * Some APIs might return an array or an object. 
     * We'll save exactly what we get.
     */

    for (const endpoint of endpoints) {
        try {
            console.log(`Fetching ${endpoint.name}...`);
            const response = await fetch(`${API_BASE_URL}${endpoint.url}`);
            
            if (!response.ok) {
                console.error(`Failed to fetch ${endpoint.name}: ${response.statusText}`);
                continue;
            }

            const data = await response.json();
            const filePath = path.join(DATA_DIR, `${endpoint.name}.json`);
            
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`Saved ${endpoint.name} to ${filePath}`);
        } catch (error) {
            console.error(`Error fetching ${endpoint.name}:`, error);
        }
    }
}

fetchData();
