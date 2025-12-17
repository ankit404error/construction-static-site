// Static Data Imports
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

// Helper to simulate async behavior for compatibility
const resolveData = (data) => Promise.resolve(data);

const api = {
    // Authentication (Disabled for static site)
    login: async () => {
        throw new Error('Login is disabled in static mode.');
    },
    verifyToken: async () => {
        return false; // Always invalid
    },

    // Home Page
    getHomePageData: () => resolveData(homepageData),
    updateHomePageData: () => Promise.reject('Updates disabled'),

    // About Page API
    getAboutPageData: () => resolveData(aboutpageData),
    updateAboutPageData: () => Promise.reject('Updates disabled'),

    // Mission Page API
    getMissionPageData: () => resolveData(missionpageData),
    updateMissionPageData: () => Promise.reject('Updates disabled'),

    // Management Page API
    getManagementPageData: () => resolveData(managementpageData),
    updateManagementPageData: () => Promise.reject('Updates disabled'),

    // Gallery Page API
    getGalleryPageData: () => resolveData(gallerypageData),
    updateGalleryPageData: () => Promise.reject('Updates disabled'),

    // Service Page API
    getServicePageData: () => resolveData(servicepageData),
    updateServicePageData: () => Promise.reject('Updates disabled'),

    // Project Page API
    getProjectPageData: () => resolveData(projectpageData),
    updateProjectPageData: () => Promise.reject('Updates disabled'),

    // Resources Page
    getResourcesPageData: () => resolveData(resourcespageData),
    updateResourcesPageData: () => Promise.reject('Updates disabled'),

    // Workforce Page
    getWorkforcePageData: () => resolveData(workforcepageData),
    updateWorkforcePageData: () => Promise.reject('Updates disabled'),

    // Image Upload (Disabled)
    uploadImage: () => Promise.reject('Uploads disabled'),

    // Layout (Header/Footer)
    getLayoutData: () => resolveData(layoutData),
    updateLayoutData: () => Promise.reject('Updates disabled'),

    // EHS Page API
    getEHSPageData: () => resolveData(ehspageData),
    updateEHSPageData: () => Promise.reject('Updates disabled'),

    // Certificate Page API
    getCertificatePageData: () => resolveData(certificatepageData),
    updateCertificatePageData: () => Promise.reject('Updates disabled'),

    // Contact Page API
    getContactPageData: () => resolveData(contactpageData),
    updateContactPageData: () => Promise.reject('Updates disabled'),

    // Career Page API
    getCareerPageData: () => resolveData(careerpageData),
    updateCareerPageData: () => Promise.reject('Updates disabled')
};

export default api;
