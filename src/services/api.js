import homepageData from '../data/homepage.json';
import aboutpageData from '../data/aboutpage.json';
import missionpageData from '../data/missionpage.json';
import managementpageData from '../data/managementpage.json';
import gallerypageData from '../data/gallerypage.json';
import servicepageData from '../data/servicepage.json';
import projectpageData from '../data/projectpage.json';
import resourcespageData from '../data/resourcespage.json';
import workforcepageData from '../data/workforcepage.json';
import layoutData from '../data/layout.json';
import ehspageData from '../data/ehspage.json';
import certificatepageData from '../data/certificatepage.json';
import contactpageData from '../data/contactpage.json';
import careerpageData from '../data/careerpage.json';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Helper to simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
    // Authentication - Mock implementation
    login: async (username, password) => {
        await delay(500); // Simulate network request
        // Accept any credentials for static version or specific hardcoded ones?
        // Let's accept 'admin'/'admin' or just return success to be safe.
        // Actually, let's keep it simple: always succeed for now to allow viewing admin UI.
        return {
            token: 'static-mock-token',
            user: { username: username || 'admin', role: 'admin' },
             message: 'Login successful (Static Mode)'
        };
    },

    verifyToken: async (token) => {
        // Always valid in static mode
        return { valid: true };
    },

    // Home Page
    getHomePageData: async () => {
        await delay(200);
        return homepageData;
    },

    updateHomePageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
        // In a real static site generator, we can't save. 
        // We just return success to satisfy the UI.
    },

    // About Page API
    getAboutPageData: async () => {
        await delay(200);
        return aboutpageData;
    },

    updateAboutPageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Mission Page API
    getMissionPageData: async () => {
        await delay(200);
        return missionpageData;
    },

    updateMissionPageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Management Page API
    getManagementPageData: async () => {
        await delay(200);
        return managementpageData;
    },

    updateManagementPageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Gallery Page API
    getGalleryPageData: async () => {
        await delay(200);
        return gallerypageData;
    },

    updateGalleryPageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Service Page API
    getServicePageData: async () => {
        await delay(200);
        return servicepageData;
    },

    updateServicePageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Project Page API
    getProjectPageData: async () => {
        await delay(200);
        return projectpageData;
    },

    updateProjectPageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Resources Page
    getResourcesPageData: async () => {
        await delay(200);
        return resourcespageData;
    },

    updateResourcesPageData: async (data, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: data };
    },

    // Workforce Page
    getWorkforcePageData: async () => {
        await delay(200);
        return workforcepageData;
    },

    updateWorkforcePageData: async (data, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: data };
    },

    // Image Upload
    uploadImage: async (file, token) => {
        await delay(500);
        console.warn('Upload ignored: Application is in static mode.');
        // Return a fake URL or the original object URL to simulate upload
        return { 
            success: true, 
            url: URL.createObjectURL(file), // This will work for the session
            message: 'Image "uploaded" (Static Mode - not persisted)' 
        };
    },

    // Layout (Header/Footer)
    getLayoutData: async () => {
        await delay(200);
        return layoutData;
    },

    updateLayoutData: async (data, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: data };
    },

    // EHS Page API
    getEHSPageData: async () => {
        await delay(200);
        return ehspageData;
    },

    updateEHSPageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Certificate Page API
    getCertificatePageData: async () => {
        await delay(200);
        return certificatepageData;
    },

    updateCertificatePageData: async (updateData, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: updateData };
    },

    // Contact Page API
    getContactPageData: async () => {
        await delay(200);
        return contactpageData;
    },

    updateContactPageData: async (data, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: data };
    },

    // Career Page API
    getCareerPageData: async () => {
        await delay(200);
        return careerpageData;
    },

    updateCareerPageData: async (data, token) => {
        await delay(500);
        console.warn('Update ignored: Application is in static mode.');
        return { success: true, data: data };
    }
};

export default api;
