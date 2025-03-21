import axios from 'axios';

class DPDClient {
    constructor() {
        this.baseUrl = "https://health-products.canada.ca/api/drug/";
    }

    async fetchData(endpoint, params = {}) {
        try {
            const response = await axios.get(`${this.baseUrl}${endpoint}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    }

    async getAllInfo(din) {
        const productInfo = await this.fetchData("drugproduct/", { lang: "en", type: "json", din });

        let drugCode = productInfo.length > 0 ? productInfo[0].drug_code : null;
        let companyName = productInfo.length > 0 ? productInfo[0].company_name : null;

        let companyCode = null;
        let companyInfo = [];

        if (companyName) {
            const allCompanies = await this.fetchData("company", { lang: "en", type: "json" });
            const matchingCompany = allCompanies.find(company => company.company_name.toLowerCase() === companyName.toLowerCase());
            if (matchingCompany) {
                companyCode = matchingCompany.company_code;
            }
        }

        const activeIngredients = drugCode ? await this.fetchData("activeingredient", { lang: "en", type: "json", id: drugCode }) : [];
        const productStatus = drugCode ? await this.fetchData("status", { lang: "en", type: "json", id: drugCode }) : [];
        const dosageForm = drugCode ? await this.fetchData("form", { lang: "en", type: "json", id: drugCode }) : [];
        const routeOfAdministration = drugCode ? await this.fetchData("route", { lang: "en", type: "json", id: drugCode }) : [];

        if (companyCode) {
            companyInfo = await this.fetchData("company", { lang: "en", type: "json", id: companyCode });
        }

        return {
            productInfo,
            activeIngredients,
            productStatus,
            companyInfo,
            dosageForm,
            routeOfAdministration
        };
    }
}

// Example usage:
// const client = new DPDClient();
// client.getAllInfo("00559407").then(data => console.log(JSON.stringify(data, null, 4)));
export default DPDClient;