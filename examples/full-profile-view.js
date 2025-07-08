exports.handler = async function(context, event, callback) {
    const response = new Twilio.Response();
    
    // Set headers to allow embedding in iframe (same as simple-profile-view)
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Content-Type', 'text/html');
    
    // Add Content-Security-Policy with proper frame-ancestors directive
    response.appendHeader('Content-Security-Policy', 
      "frame-ancestors 'self' https://flex.twilio.com https://*.flex.twilio.com https://*.twilio.com https://*.twil.io https://connie.team https://*.connie.team https://dev.connie.team https://portal.connie.team https://connie.technology https://*.augmentcxm.com https://i.postimg.cc https://*.postimg.cc");
    
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
        // Make server-side API call to get full profile data
        const axios = require('axios');
        const normalizedPhone = phone.replace(/[^+\d]/g, '');
        const apiUrl = `https://connie.technology/profiles?phoneNumber=${encodeURIComponent(normalizedPhone)}`;
        
        console.log('full-profile-view: Fetching profile for phone:', normalizedPhone);
        
        const apiResponse = await axios.get(apiUrl);
        
        if (!apiResponse.data.profile) {
            const notFoundHtml = generateNotFoundHtml(normalizedPhone);
            response.setBody(notFoundHtml);
            return callback(null, response);
        }
        
        const profile = apiResponse.data.profile;
        console.log('full-profile-view: Profile found:', profile.id);
        
        // Generate rich HTML with all profile data
        const htmlContent = generateFullProfileHtml(profile);
        response.setBody(htmlContent);
        
        return callback(null, response);
        
    } catch (error) {
        console.error('full-profile-view: Error fetching profile:', error);
        const errorHtml = generateErrorHtml('Failed to fetch profile data');
        response.setBody(errorHtml);
        return callback(null, response);
    }
};

function generateFullProfileHtml(profile) {
    // Helper function to safely display field values
    const safeDisplay = (value) => value && value !== '' ? value : 'Not provided';
    const hasValue = (value) => value && value !== '' && value !== null;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Full Profile View - ${profile.firstname} ${profile.lastname}</title>
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
                display: block;
                object-fit: cover;
                background-color: #ccc;
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
            <!-- Profile Header -->
            <div class="profile-header">
                ${hasValue(profile['Profile Image']) ? 
                    `<img src="${profile['Profile Image']}" alt="Profile Photo" class="profile-avatar" onerror="this.style.display='none'">` :
                    `<div class="profile-avatar" style="background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">${profile.firstname ? profile.firstname.charAt(0) : '?'}${profile.lastname ? profile.lastname.charAt(0) : ''}</div>`
                }
                <h1 class="profile-name">${profile.firstname || 'Unknown'} ${profile.lastname || 'Name'}</h1>
                <p class="profile-phone">${profile.phone}</p>
            </div>
            
            <div class="profile-sections">
                <!-- Basic Information -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="section-icon">👤</span>
                        Basic Information
                    </h2>
                    
                    <div class="field-row">
                        <span class="field-label">Email:</span>
                        <span class="field-value">
                            ${hasValue(profile.email) ? 
                                `<a href="mailto:${profile.email}" class="contact-link">${profile.email}</a>` : 
                                '<span class="empty-state">Not provided</span>'
                            }
                        </span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Date of Birth:</span>
                        <span class="field-value">${safeDisplay(profile.DOB)}</span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Language:</span>
                        <span class="field-value">${safeDisplay(profile.language)}</span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Location:</span>
                        <span class="field-value">${safeDisplay(profile.Location)}</span>
                    </div>
                </div>
                
                <!-- Programs & Services -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="section-icon">🏥</span>
                        Programs & Services
                    </h2>
                    
                    <div class="field-row">
                        <span class="field-label">Enrolled Programs:</span>
                        <div class="programs-container">
                            ${hasValue(profile.program_1) ? `<span class="program-tag">${profile.program_1}</span>` : ''}
                            ${hasValue(profile.program_2) ? `<span class="program-tag">${profile.program_2}</span>` : ''}
                            ${hasValue(profile.program_3) ? `<span class="program-tag">${profile.program_3}</span>` : ''}
                            ${!hasValue(profile.program_1) && !hasValue(profile.program_2) && !hasValue(profile.program_3) ? 
                                '<span class="empty-state">No programs enrolled</span>' : ''
                            }
                        </div>
                    </div>
                </div>
                
                <!-- Healthcare Provider -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="section-icon">⚕️</span>
                        Primary Care Provider
                    </h2>
                    
                    <div class="field-row">
                        <span class="field-label">Provider Name:</span>
                        <span class="field-value">${safeDisplay(profile.pcp)}</span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Contact:</span>
                        <span class="field-value">
                            ${hasValue(profile.pcp_contact) ? 
                                `<a href="tel:${profile.pcp_contact}" class="contact-link">${profile.pcp_contact}</a>` : 
                                '<span class="empty-state">Not provided</span>'
                            }
                        </span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Affiliation:</span>
                        <span class="field-value">${safeDisplay(profile.pcp_affiliation)}</span>
                    </div>
                </div>
                
                <!-- Emergency Contact -->
                ${hasValue(profile.primary_caregiver) || hasValue(profile.primary_caregiver_phone) ? `
                <div class="section">
                    <h2 class="section-title">
                        <span class="section-icon">👥</span>
                        Primary Caregiver
                    </h2>
                    
                    <div class="field-row">
                        <span class="field-label">Name:</span>
                        <span class="field-value">${safeDisplay(profile.primary_caregiver)}</span>
                    </div>
                    
                    <div class="field-row">
                        <span class="field-label">Phone:</span>
                        <span class="field-value">
                            ${hasValue(profile.primary_caregiver_phone) ? 
                                `<a href="tel:${profile.primary_caregiver_phone}" class="contact-link">${profile.primary_caregiver_phone}</a>` : 
                                '<span class="empty-state">Not provided</span>'
                            }
                        </span>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        
        <script>
            // Handle image load errors gracefully
            document.addEventListener('DOMContentLoaded', function() {
                const profileImg = document.querySelector('.profile-avatar');
                if (profileImg && profileImg.tagName === 'IMG') {
                    profileImg.addEventListener('error', function() {
                        const initials = '${profile.firstname ? profile.firstname.charAt(0) : '?'}${profile.lastname ? profile.lastname.charAt(0) : ''}';
                        const initialsDiv = document.createElement('div');
                        initialsDiv.className = 'profile-avatar';
                        initialsDiv.style.cssText = 'background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: white;';
                        initialsDiv.textContent = initials;
                        this.parentNode.replaceChild(initialsDiv, this);
                    });
                }
            });
        </script>
    </body>
    </html>
    `;
}

function generateErrorHtml(message) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Profile View - Error</title>
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
        <title>Profile View - Not Found</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
            .not-found { color: #f57c00; background: #fff3e0; padding: 20px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="not-found">
            <h2>Profile Not Found</h2>
            <p>No profile found for phone number: ${phone}</p>
        </div>
    </body>
    </html>
    `;
}
