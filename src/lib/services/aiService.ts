// ============================================
// 2. AI-POWERED PDF IMPORT WITH HUGGING FACE
// ============================================

// src/lib/services/aiService.ts
export class AIService {
  private apiKey: string
  private model: string = 'mistralai/Mixtral-8x7B-Instruct-v0.1' // Free on HuggingFace

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || ''
  }

  async extractPriceListFromText(text: string): Promise<any[]> {
    const prompt = `You are an expert at extracting structured data from vendor price lists for electrical components.

Extract ALL components from this price list and return them in JSON format. Each component should have:
- vendor: string (e.g., "Schneider", "ABB", "CHINT")
- item: string (e.g., "ACB", "MCCB", "Busbar", "Digital Meter")
- model: string (e.g., "EDO 5000A 4P", "NSX 630A 4P")
- manufacturer: string
- price: number (in Naira if NGN, convert USD to NGN using 1650 rate)
- currency: string ("NGN" or "USD")
- amperage: string or null (e.g., "5000", "630")
- poles: string or null (e.g., "2P", "3P", "4P")
- type: string or null (e.g., "ACB", "MCCB", "MCB")
- category: string ("breaker", "busbar", "accessory", "enclosure", "meter", "other")

Price list text:
${text}

Return ONLY a valid JSON array, nothing else. Example:
[{"vendor":"Schneider","item":"ACB","model":"EDO 5000A 4P","manufacturer":"Schneider","price":38000000,"currency":"NGN","amperage":"5000","poles":"4P","type":"ACB","category":"breaker"}]`

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 2000,
              temperature: 0.1,
              return_full_text: false,
            },
          }),
        }
      )

      const result = await response.json()
      const generatedText = result[0]?.generated_text || ''
      
      // Extract JSON from response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      throw new Error('Failed to extract valid JSON from AI response')
    } catch (error) {
      console.error('AI extraction error:', error)
      throw error
    }
  }

  async analyzePastQuotes(quotes: any[]): Promise<{
    commonPatterns: any
    recommendations: string[]
    priceOptimizations: any[]
  }> {
    const prompt = `Analyze these electrical panel quotations and identify:
1. Common panel configurations and patterns
2. Most frequently used components
3. Price optimization opportunities
4. Recommendations for future quotes

Quotations data:
${JSON.stringify(quotes.slice(0, 10), null, 2)}

Return analysis as JSON with keys: commonPatterns, recommendations, priceOptimizations`

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 1500,
              temperature: 0.3,
            },
          }),
        }
      )

      const result = await response.json()
      const generatedText = result[0]?.generated_text || '{}'
      
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      return {
        commonPatterns: {},
        recommendations: [],
        priceOptimizations: [],
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      throw error
    }
  }

  async suggestComponents(panelRequirements: {
    mainAmperage: string
    panelType: string
    numberOfOutgoings: number
  }): Promise<any> {
    const prompt = `Based on these panel requirements, suggest appropriate components:
- Main Amperage: ${panelRequirements.mainAmperage}A
- Panel Type: ${panelRequirements.panelType}
- Number of Outgoings: ${panelRequirements.numberOfOutgoings}

Suggest:
1. Appropriate incomer breaker(s)
2. Busbar rating
3. Outgoing breaker sizes
4. Required accessories (meter, CTs, indicator lamps, etc.)
5. Estimated enclosure size

Return as JSON with keys: incomer, busbar, outgoings, accessories, enclosure`

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 1000,
              temperature: 0.2,
            },
          }),
        }
      )

      const result = await response.json()
      return result[0]?.generated_text || ''
    } catch (error) {
      console.error('AI suggestion error:', error)
      throw error
    }
  }
}