
export function categorizeClient(description: string): string {
    const lower = description.toLowerCase();
    
    // Travel & Transport
    if (lower.includes('uber') || lower.includes('ola') || lower.includes('flight') || 
        lower.includes('indigo') || lower.includes('train') || lower.includes('bus') || 
        lower.includes('petrol') || lower.includes('fuel') || lower.includes('parking')) {
        return 'Transport';
    }
    
    // Food & Dining
    if (lower.includes('swiggy') || lower.includes('zomato') || lower.includes('starbucks') || 
        lower.includes('restaurant') || lower.includes('pizza') || lower.includes('burger') || 
        lower.includes('grocery') || lower.includes('blinkit') || lower.includes('zepto')) {
        return 'Food';
    }
    
    // Software & Business
    if (lower.includes('aws') || lower.includes('google cloud') || lower.includes('openai') || 
        lower.includes('github') || lower.includes('cursor') || lower.includes('zoom') || 
        lower.includes('hosting') || lower.includes('domain') || lower.includes('slack')) {
        return 'Software';
    }
    
    // Health & Fitness
    if (lower.includes('hospital') || lower.includes('pharmacy') || lower.includes('medicine') || 
        lower.includes('gym') || lower.includes('cult') || lower.includes('doctor')) {
        return 'Health';
    }
    
    // Entertainment
    if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('youtube') || 
        lower.includes('hotstar') || lower.includes('prime') || lower.includes('movie')) {
        return 'Entertainment';
    }

    return 'Others';
}
