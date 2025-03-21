import axios from 'axios';

class LNPHDClient {
    constructor() {
        this.baseUrl = "https://health-products.canada.ca/api/natural-licences/";
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

    async getAllInfo(productId) {
        const medicinalIngredients = await this.fetchData("medicinalingredient", { lang: "en", type: "json", id: productId });
        const nonMedicinalIngredients = await this.fetchData("nonmedicinalingredient", { lang: "en", type: "json", id: productId });
        const productDose = await this.fetchData("productdose", { lang: "en", type: "json", id: productId });
        const productPurpose = await this.fetchData("productpurpose", { lang: "en", type: "json", id: productId });
        const productRisk = await this.fetchData("productrisk", { lang: "en", type: "json", id: productId });
        const productRoute = await this.fetchData("productroute", { lang: "en", type: "json", id: productId });

        return {
            medicinalIngredients: medicinalIngredients.data || [],
            nonMedicinalIngredients,
            productDose,
            productPurpose: productPurpose.data || [],
            productRisk: productRisk.data || [],
            productRoute
        };
    }
}

// Example usage:
// const client = new LNPHDClient();
// client.getAllInfo("6006624").then(data => console.log(JSON.stringify(data, null, 4)));
export default LNPHDClient;