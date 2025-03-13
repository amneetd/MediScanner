import urllib.request
import json
from urllib.parse import urlencode
import ssl
import certifi


class DPDClient:
    def __init__(self):
        self.base_url = "https://health-products.canada.ca/api/drug/"

    def fetch_data(self, endpoint, params=None):
        if params is None:
            params = {}
        query_string = urlencode(params)
        url = f"{self.base_url}{endpoint}?{query_string}"
        context = ssl.create_default_context(cafile=certifi.where())
        with urllib.request.urlopen(url, context=context) as response:
            data = response.read().decode("utf-8")
        return json.loads(data)

    def get_all_info(self, din):
        product_info = self.fetch_data("drugproduct/", {"lang": "en", "type": "json", "din": din})

        # Extract the drug code and company name if available
        drug_code = product_info[0].get("drug_code") if product_info else None
        company_name = product_info[0].get("company_name") if product_info else None

        # Fetch all companies from the API
        all_companies = self.fetch_data("company", {"lang": "en", "type": "json"})

        # Find the matching company code based on company name
        company_code = next((company["company_code"] for company in all_companies if
                             company["company_name"].lower() == company_name.lower()), None) if company_name else None

        if drug_code:
            active_ingredients = self.fetch_data("activeingredient", {"lang": "en", "type": "json", "id": drug_code})
            product_status = self.fetch_data("status", {"lang": "en", "type": "json", "id": drug_code})
            dosage_form = self.fetch_data("form", {"lang": "en", "type": "json", "id": drug_code})
            route_of_administration = self.fetch_data("route", {"lang": "en", "type": "json", "id": drug_code})
        else:
            active_ingredients = product_status = dosage_form = route_of_administration = []

        if company_code:
            company_info = self.fetch_data("company", {"lang": "en", "type": "json", "id": company_code})
        else:
            company_info = []

        return {
            "product_info": product_info,
            "active_ingredients": active_ingredients,
            "product_status": product_status,
            "company_info": company_info,
            "dosage_form": dosage_form,
            "route_of_administration": route_of_administration
        }


if __name__ == "__main__":
    client = DPDClient()
    din_number = "00559407"  # Replace with the actual DIN
    all_info = client.get_all_info(din_number)
    print(json.dumps(all_info, indent=4))