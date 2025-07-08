/**
 * ConnieRTC Customer Lookup Function
 * 
 * This function demonstrates real-time customer data lookup for nonprofit call centers.
 * It can be configured to work with Google Sheets, MySQL, or any REST API.
 * 
 * For production deployments, replace the sample data with your actual data source.
 */

const axios = require('axios');

exports.handler = async (context, event, callback) => {
    const response = new Twilio.Response();
    
    // Enable CORS for Flex UI integration
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (event.RequestMethod === 'OPTIONS') {
        response.setStatusCode(200);
        callback(null, response);
        return;
    }
    
    try {
        const { phone } = event;
        
        if (!phone) {
            response.setStatusCode(400);
            response.setBody({ error: 'Phone number is required' });
            callback(null, response);
            return;
        }
        
        // Clean phone number for comparison (remove +1, spaces, special chars)
        const cleanPhone = phone.replace(/^\+?1?/, '').replace(/\D/g, '');
        
        console.log(`[ConnieRTC] Looking up customer for phone: ${cleanPhone}`);
        
        // DEMO MODE: Sample customer data
        // In production, replace this with your actual data source
        const customer = await lookupCustomer(cleanPhone, context);
        
        if (customer) {
            console.log(`[ConnieRTC] Customer found: ${customer.first_name} ${customer.last_name}`);
            
            response.setBody({
                found: true,
                customer: customer,
                profile_url: generateProfileUrl(customer, context),
                timestamp: new Date().toISOString(),
                source: context.DATA_SOURCE || 'demo'
            });
        } else {
            console.log(`[ConnieRTC] No customer found for phone: ${cleanPhone}`);
            
            response.setBody({
                found: false,
                customer: null,
                profile_url: generateFallbackUrl(phone, context),
                timestamp: new Date().toISOString(),
                source: context.DATA_SOURCE || 'demo'
            });
        }
        
        response.setStatusCode(200);
        callback(null, response);
        
    } catch (error) {
        console.error('[ConnieRTC] Error looking up customer:', error);
        
        response.setStatusCode(500);
        response.setBody({ 
            error: 'Internal server error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
        callback(null, response);
    }
};

/**
 * Lookup customer data from configured data source
 */
async function lookupCustomer(cleanPhone, context) {
    const dataSource = context.DATA_SOURCE || 'demo';
    
    switch (dataSource.toLowerCase()) {
        case 'google-sheets':
            return await lookupFromGoogleSheets(cleanPhone, context);
        case 'mysql':
            return await lookupFromMySQL(cleanPhone, context);
        case 'api':
            return await lookupFromAPI(cleanPhone, context);
        case 'demo':
        default:
            return lookupFromDemo(cleanPhone);
    }
}

/**
 * Demo data source - perfect for testing and demonstrations
 */
function lookupFromDemo(cleanPhone) {
    const demoCustomers = {
        '5109309015': {
            first_name: 'Mickey',
            last_name: 'Mouse',
            email: 'mickey@disney.com',
            programs: 'SNP, Food Bank',
            notes: 'Demo customer - Regular food bank visitor, family of 4',
            address: '123 Main St, Anytown USA',
            emergency_contact: 'Minnie Mouse (555) 123-4567',
            dietary_restrictions: 'None',
            last_visit: '2025-06-10'
        },
        '5551234567': {
            first_name: 'Donald',
            last_name: 'Duck',
            email: 'donald@disney.com',
            programs: 'Housing Assistance, Crisis Support',
            notes: 'Needs temporary housing assistance, employed part-time',
            address: '456 Oak Ave, Anytown USA',
            emergency_contact: 'Daisy Duck (555) 987-6543',
            dietary_restrictions: 'Vegetarian',
            last_visit: '2025-06-12'
        },
        '5559876543': {
            first_name: 'Goofy',
            last_name: 'Goof',
            email: 'goofy@disney.com',
            programs: 'Crisis Support, Job Training',
            notes: 'Single parent, looking for job training opportunities',
            address: '789 Pine St, Anytown USA',
            emergency_contact: 'Max Goof (555) 246-8135',
            dietary_restrictions: 'Gluten-free',
            last_visit: '2025-06-08'
        }
    };
    
    return demoCustomers[cleanPhone] || null;
}

/**
 * Google Sheets data source
 */
async function lookupFromGoogleSheets(cleanPhone, context) {
    if (!context.GOOGLE_SHEETS_API_KEY || !context.GOOGLE_SHEET_ID) {
        throw new Error('Google Sheets configuration missing');
    }
    
    const range = context.GOOGLE_SHEETS_RANGE || 'Sheet1!A:Z';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${context.GOOGLE_SHEET_ID}/values/${range}?key=${context.GOOGLE_SHEETS_API_KEY}`;
    
    try {
        const response = await axios.get(url);
        const rows = response.data.values;
        
        if (!rows || rows.length === 0) {
            return null;
        }
        
        const headers = rows[0];
        const phoneIndex = headers.findIndex(h => h.toLowerCase() === 'phone');
        
        if (phoneIndex === -1) {
            throw new Error('Phone column not found in Google Sheet');
        }
        
        const customerRow = rows.slice(1).find(row => {
            const rowPhone = row[phoneIndex]?.replace(/^\+?1?/, '').replace(/\D/g, '');
            return rowPhone === cleanPhone;
        });
        
        if (customerRow) {
            const customer = {};
            headers.forEach((header, index) => {
                customer[header.toLowerCase().replace(/\s+/g, '_')] = customerRow[index] || '';
            });
            return customer;
        }
        
        return null;
        
    } catch (error) {
        console.error('Google Sheets lookup error:', error);
        throw error;
    }
}

/**
 * MySQL data source
 */
async function lookupFromMySQL(cleanPhone, context) {
    // This would require mysql2 package and proper connection setup
    // For now, return demo data
    console.log('MySQL lookup not implemented in demo, using fallback');
    return lookupFromDemo(cleanPhone);
}

/**
 * Custom API data source
 */
async function lookupFromAPI(cleanPhone, context) {
    if (!context.CUSTOM_API_ENDPOINT) {
        throw new Error('Custom API endpoint not configured');
    }
    
    try {
        const url = `${context.CUSTOM_API_ENDPOINT}?phone=${encodeURIComponent('+1' + cleanPhone)}`;
        const headers = {};
        
        if (context.CUSTOM_API_KEY) {
            headers['Authorization'] = `Bearer ${context.CUSTOM_API_KEY}`;
        }
        
        const response = await axios.get(url, { headers });
        return response.data.customer || null;
        
    } catch (error) {
        console.error('Custom API lookup error:', error);
        return null;
    }
}

/**
 * Generate profile URL for found customers
 */
function generateProfileUrl(customer, context) {
    const baseUrl = context.PROFILE_BASE_URL || 'https://demo.connie.technology/profile';
    
    // Create a profile URL with customer data
    const params = new URLSearchParams({
        name: `${customer.first_name} ${customer.last_name}`,
        phone: customer.phone || 'Unknown',
        email: customer.email || '',
        programs: customer.programs || '',
        notes: customer.notes || ''
    });
    
    return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate fallback URL for unknown callers
 */
function generateFallbackUrl(phone, context) {
    const baseUrl = context.PROFILE_BASE_URL || 'https://demo.connie.technology/profile';
    
    const params = new URLSearchParams({
        name: 'Unknown Caller',
        phone: phone,
        email: '',
        programs: '',
        notes: 'No customer record found'
    });
    
    return `${baseUrl}?${params.toString()}`;
}
