import urllib.request
import json
from urllib.parse import urlencode

class DPDClient:
    def __init__(self):
        self.base_url = "https://health-products.canada.ca/api/drug/drugproduct/"

    def get_product_info_based_on_din(self, search_params=None):
        """
        Fetch drug products from the Health Canada Drug Product Database.
        :param search_params: A string (drug name) to search for.
        :return: A JSON response containing drug product details.
        """
        query_params = {'lang': 'en', 'type': 'json', 'din': search_params}
        query_string = urlencode(query_params)
        url = self.base_url + '?' + query_string

        with urllib.request.urlopen(url) as response:
            data = response.read().decode('utf-8')

        return json.loads(data)  # Return the response as a JSON object

    def get_product_info_based_on_name(self, search_params=None):
        """
        Fetch drug products from the Health Canada Drug Product Database.
        :param search_params: A string (drug name) to search for.
        :return: A JSON response containing drug product details.
        """
        query_params = {'lang': 'en', 'type': 'json', 'brandname': search_params}
        query_string = urlencode(query_params)
        url = self.base_url + '?' + query_string

        with urllib.request.urlopen(url) as response:
            data = response.read().decode('utf-8')

        return json.loads(data)  # Return the response as a JSON object

# Example usage
if __name__ == '__main__':
    client = DPDClient()
    product_based_on_name = client.get_product_info_based_on_name("tylenol")
    #if product_based_on_name:
    #     for product in product_based_on_name:
    #         print(product)

    product_based_on_din = client.get_product_info_based_on_din("02544687")
    if product_based_on_din:
        print(product_based_on_din)