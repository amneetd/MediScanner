import urllib.request
import json
from urllib.parse import urlencode
import ssl
import certifi


class LNPHDClient:
    def __init__(self):
        self.base_url = "https://health-products.canada.ca/api/natural-licences/"

    def fetch_data(self, endpoint, params=None):
        if params is None:
            params = {}
        query_string = urlencode(params)
        url = f"{self.base_url}{endpoint}?{query_string}"
        context = ssl.create_default_context(cafile=certifi.where())
        with urllib.request.urlopen(url, context=context) as response:
            data = response.read().decode("utf-8")
        return json.loads(data)

    def get_all_info(self, product_id):
        medicinal_ingredients = self.fetch_data("medicinalingredient", {"lang": "en", "type": "json", "id": product_id})
        non_medicinal_ingredients = self.fetch_data("nonmedicinalingredient",
                                                    {"lang": "en", "type": "json", "id": product_id})
        product_dose = self.fetch_data("productdose", {"lang": "en", "type": "json", "id": product_id})
        product_purpose = self.fetch_data("productpurpose", {"lang": "en", "type": "json", "id": product_id})
        product_risk = self.fetch_data("productrisk", {"lang": "en", "type": "json", "id": product_id})
        product_route = self.fetch_data("productroute", {"lang": "en", "type": "json", "id": product_id})

        return {
            "medicinal_ingredients": medicinal_ingredients["data"],
            "non_medicinal_ingredients": non_medicinal_ingredients,
            "product_dose": product_dose,
            "product_purpose": product_purpose["data"],
            "product_risk": product_risk["data"],
            "product_route": product_route
        }


if __name__ == "__main__":
    client = LNPHDClient()
    product_id = "6006624"  # Replace with the actual NPN
    all_info = client.get_all_info(product_id)
    print(json.dumps(all_info, indent=4))