import axios from 'axios';





export const retrieveMonograph = async (id, npnOrDin) => {
    const npnDinConversion = {"NPN" : "Natural Product Number", "DIN" : "Drug Identification Number"}
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + "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"
        },
        body: JSON.stringify({
            "model": "sonar-pro",
            "messages": [
                {
                    role: "user",
                    content: `Using the ${npnDinConversion[npnOrDin]} (${npnOrDin}) ${id}, find the medication’s information from Canadian sources (e.g. Health Canada’s Drug Product Database or the drug’s official product monograph). Then provide a high-quality, concise summary with the following sections:
        
        Drug Name – official name of the product.
        
        Active Ingredient(s) & Strength –
        
        Indications (What it is used for) – what conditions or symptoms this drug treats.
        
        Common Side Effects – list the most common side effects with brief details.
        
        Serious Side Effects – any rare but serious adverse effects
        
        Contraindications – who should NOT take this medication.
        
        Warnings & Precautions – important cautions (including age restrictions, pregnancy/breastfeeding warnings, and advice about activities like driving).
        
        Drug Interactions – notable interactions with other drugs, alcohol, or foods.
        Format this entire reponse as json, without any response message in it telling me it is in json format.`
                  }            ],
            "max_tokens": 1000
        })
    })
    const dataAsJsonResponse = await response.json();
    const dataAsJson = JSON.parse(dataAsJsonResponse.choices[0].message.content);
    dataAsJson["sources"] = dataAsJsonResponse.citations;
    console.log(dataAsJsonResponse);
    return dataAsJson;
}

