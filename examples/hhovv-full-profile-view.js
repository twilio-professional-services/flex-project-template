exports.handler = async function(context, event, callback) {
    const response = new Twilio.Response();
    
    // Set headers to allow embedding in iframe (same as DevSandBox version)
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Content-Type', 'text/html');
    
    // Add Content-Security-Policy with proper frame-ancestors directive
    response.appendHeader('Content-Security-Policy', 
      "frame-ancestors 'self' https://flex.twilio.com https://*.flex.twilio.com https://*.twilio.com https://*.twil.io https://connie.team https://*.connie.team https://dev.connie.team https://portal.connie.team https://connie.technology https://*.augmentcxm.com https://jshhnlv.org");
    
    // Add cache control headers
    response.appendHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.appendHeader('Pragma', 'no-cache');
    response.appendHeader('Expires', '0');
    
    const { phone } = event;
    
    if (!phone) {
        const errorHtml = generateErrorHtml('Phone number is required');
        response.setBody(errorHtml);
        return callback(null, response);
    }
    
    try {
        // Make server-side API call to get HHOVV profile data
        const axios = require('axios');
        const normalizedPhone = phone.replace(/[^+\d]/g, '').replace(/^\+1/, ''); // Remove +1 for HHOVV API
        const apiUrl = `https://jshhnlv.org/app/api/phone/${normalizedPhone}`;
        
        console.log('hhovv-full-profile-view: Fetching profile for phone:', normalizedPhone);
        
        const apiResponse = await axios.get(apiUrl, {
            auth: {
                username: 'connie',
                password: '4H83c#21'
            }
        });
        
        if (!apiResponse.data.data || apiResponse.data.data.length === 0) {
            const notFoundHtml = generateNotFoundHtml(normalizedPhone);
            response.setBody(notFoundHtml);
            return callback(null, response);
        }
        
        const profile = apiResponse.data.data[0]; // HHOVV returns array, take first result
        console.log('hhovv-full-profile-view: Profile found:', profile.id);
        
        // Generate rich HTML with HHOVV profile data
        const htmlContent = generateHHOVVProfileHtml(profile);
        response.setBody(htmlContent);
        
        return callback(null, response);
        
    } catch (error) {
        console.error('hhovv-full-profile-view: Error fetching profile:', error);
        const errorHtml = generateErrorHtml('Failed to fetch profile data');
        response.setBody(errorHtml);
        return callback(null, response);
    }
};

function generateHHOVVProfileHtml(profile) {
    // Helper function to safely display field values
    const safeDisplay = (value) => value && value !== '' ? value : 'Not provided';
    const hasValue = (value) => value && value !== '' && value !== null;
    
    // Parse name into first/last for initials (HHOVV has single name field)
    const getInitials = () => {
        if (!profile.name) return '?';
        const nameParts = profile.name.split(' ');
        const first = nameParts[0] ? nameParts[0].charAt(0) : '?';
        const last = nameParts[nameParts.length - 1] && nameParts.length > 1 ? 
                    nameParts[nameParts.length - 1].charAt(0) : '';
        return first + last;
    };
    
    // Expand program codes (org-specific configuration needed)
    const expandProgram = (code) => {
        const programMap = {
            'SNP': 'SNP Program', // TODO: Get actual program name from HHOVV team
            // Add more mappings as needed
        };
        return programMap[code] || code;
    };
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>HHOVV Profile View - ${profile.name || 'Unknown Name'}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Twilio Paste CSS -->
        <link href="https://assets.twilio.com/public_assets/paste-fonts/main/1.5.2/fonts.css" rel="stylesheet" />
        <link href="https://paste.twilio.design/core/18.6.1/theme.css" rel="stylesheet" />
        
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 16px;
                background-color: #f4f4f6;
                line-height: 1.5;
            }
            
            .profile-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            
            .profile-header {
                background: linear-gradient(135deg, #0263E0 0%, #1976D2 100%);
                color: white;
                padding: 24px;
                text-align: center;
            }
            
            .profile-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 3px solid white;
                margin: 0 auto 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                background: rgba(255,255,255,0.2);
            }
            
            .profile-name {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 8px 0;
            }
            
            .profile-phone {
                font-size: 16px;
                opacity: 0.9;
                margin: 0;
            }
            
            .profile-sections {
                padding: 0;
            }
            
            .section {
                border-bottom: 1px solid #e1e3ea;
                padding: 20px 24px;
            }
            
            .section:last-child {
                border-bottom: none;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #1976D2;
                margin: 0 0 16px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .section-icon {
                font-size: 20px;
            }
            
            .field-row {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 12px;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .field-row:last-child {
                margin-bottom: 0;
            }
            
            .field-label {
                font-weight: 600;
                color: #606B85;
                min-width: 140px;
                font-size: 14px;
            }
            
            .field-value {
                color: #121C2D;
                flex: 1;
                font-size: 14px;
                text-align: right;
            }
            
            .program-tag {
                display: inline-block;
                background: #E1F5FE;
                color: #0277BD;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 500;
                margin: 2px 4px 2px 0;
            }
            
            .programs-container {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                justify-content: flex-end;
                max-width: 60%;
            }
            
            .contact-link {
                color: #1976D2;
                text-decoration: none;
            }
            
            .contact-link:hover {
                text-decoration: underline;
            }
            
            .empty-state {
                color: #606B85;
                font-style: italic;
            }
            
            .data-note {
                background: #fff3e0;
                border-left: 4px solid #f57c00;
                padding: 12px;
                margin: 16px 0;
                font-size: 12px;
                color: #e65100;
            }
            
            @media (max-width: 480px) {
                .field-row {
                    flex-direction: column;
                    align-items: start;
                }
                
                .field-value {
                    text-align: left;
                }
                
                .programs-container {
                    max-width: 100%;
                    justify-content: flex-start;
                }
            }
        </style>
    </head>
    <body>
        <div class="profile-container">
            <!-- Profile Header with Initials (no profile images in HHOVV) -->
            <div class="profile-header">
                <div class="profile-avatar">${getInitials()}</div>
                <h1 class="profile-name">${profile.name || 'Unknown Name'}</h1>
                <p class="profile-phone">${profile.primaryPhone ? '+1' + profile.primaryPhone : 'No phone'}</p>
            </div>
            
            <div class="profile-sections">
                <!-- Basic Information -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="section-icon">👤</span>
                        Basic Information
                    </h2>
                    
                    <div class="field-row">
                        <span class="field-label">Client ID:</span>
                        <span class="field-value">${profile.id}</span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Primary Email:</span>
                        <span class="field-value">
                            ${hasValue(profile.email) ? 
                                `<a href="mailto:${profile.email}" class="contact-link">${profile.email}</a>` : 
                                '<span class="empty-state">Not provided</span>'
                            }
                        </span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Secondary Phone:</span>
                        <span class="field-value">
                            ${hasValue(profile.secondaryPhone) ? 
                                `<a href="tel:+1${profile.secondaryPhone}" class="contact-link">+1${profile.secondaryPhone}</a>` : 
                                '<span class="empty-state">Not provided</span>'
                            }
                        </span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">ZIP Code:</span>
                        <span class="field-value">${safeDisplay(profile.addressZip)}</span>
                    </div>
                </div>
                
                <!-- Programs & Services -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="section-icon">🏠</span>
                        Programs & Services
                    </h2>
                    
                    <div class="field-row">
                        <span class="field-label">Enrolled Programs:</span>
                        <div class="programs-container">
                            ${hasValue(profile.programs) ? 
                                `<span class="program-tag">${expandProgram(profile.programs)}</span>` : 
                                '<span class="empty-state">No programs enrolled</span>'
                            }
                        </div>
                    </div>
                    
                    <!-- Note about program codes -->
                    ${profile.programs && profile.programs === expandProgram(profile.programs) ? `
                    <div class="data-note">
                        <strong>Configuration Note:</strong> Program code "${profile.programs}" needs mapping to display name. 
                        This would be configured during organization setup.
                    </div>
                    ` : ''}
                </div>
                
                <!-- Data Comparison Note (for basecamp learning) -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="section-icon">📊</span>
                        Data Architecture
                    </h2>
                    
                    <div class="data-note">
                        <strong>HHOVV vs DevSandBox Comparison:</strong><br>
                        • <strong>HHOVV:</strong> 6 fields, lean social services data<br>
                        • <strong>DevSandBox:</strong> 15+ fields, rich healthcare data<br>
                        • <strong>Basecamp:</strong> Flexible template adapts to both schemas
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Available Fields:</span>
                        <span class="field-value">6 total</span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Data Richness:</span>
                        <span class="field-value">Lean (Social Services)</span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Missing Sections:</span>
                        <span class="field-value">Healthcare, Caregivers, Demographics</span>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

function generateErrorHtml(message) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>HHOVV Profile View - Error</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
            .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="error">
            <h2>Error</h2>
            <p>${message}</p>
        </div>
    </body>
    </html>
    `;
}

function generateNotFoundHtml(phone) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>HHOVV Profile View - Not Found</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
            .not-found { color: #f57c00; background: #fff3e0; padding: 20px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="not-found">
            <h2>Profile Not Found</h2>
            <p>No HHOVV profile found for phone number: ${phone}</p>
        </div>
    </body>
    </html>
    `;
}
