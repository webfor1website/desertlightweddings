// Wedding Website Generator

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wedding-form');
    const photoUpload = document.getElementById('photo-upload');
    const photoInput = document.getElementById('photos');
    const photoPreview = document.getElementById('photo-preview');
    
    let uploadedPhotos = [];
    
    // Photo upload handling with compression
    photoUpload.addEventListener('click', function() {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files).slice(0, 5);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Create canvas for compression
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Resize to max 500px width/height
                    const maxSize = 500;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG at 0.5 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
                    uploadedPhotos.push(compressedDataUrl);
                    updatePhotoPreview();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    });
    
    function updatePhotoPreview() {
        photoPreview.innerHTML = uploadedPhotos.map((photo, index) => 
            `<img src="${photo}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px;">`
        ).join('');
    }
    
    // Generate unique serial number
    function generateSerialNumber() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let serial = 'DLW-';
        for (let i = 0; i < 4; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        serial += '-';
        for (let i = 0; i < 4; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return serial;
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Generate serial number
        const serialNumber = generateSerialNumber();
        
        // Collect form data
        const weddingData = {
            serialNumber: serialNumber,
            partner1: document.getElementById('partner1').value,
            partner2: document.getElementById('partner2').value,
            weddingDate: document.getElementById('wedding-date').value,
            venue: document.getElementById('venue').value,
            location: document.getElementById('location').value,
            loveStory: document.getElementById('love-story').value,
            photos: uploadedPhotos,
            bridesmaids: [],
            groomsmen: [],
            registry: [],
            hotelInfo: document.getElementById('hotel-info').value,
            rsvpEmail: document.getElementById('rsvp-email').value,
            urlSlug: document.getElementById('url-slug').value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            createdAt: new Date().toISOString()
        };
        
        // Collect bridesmaids
        document.querySelectorAll('.party-inputs input').forEach((input, index) => {
            if (index < 6 && input.value.trim()) {
                weddingData.bridesmaids.push(input.value.trim());
            }
        });
        
        // Collect groomsmen
        document.querySelectorAll('.party-inputs input').forEach((input, index) => {
            if (index >= 6 && index < 12 && input.value.trim()) {
                weddingData.groomsmen.push(input.value.trim());
            }
        });
        
        // Collect registry links
        document.querySelectorAll('.registry-inputs input').forEach(input => {
            if (input.value.trim()) {
                let url = input.value.trim();
                // Add https:// if missing
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                weddingData.registry.push(url);
            }
        });
        
        // Insert into Supabase
        try {
            const { data, error } = await supabaseClient
                .from('weddings')
                .insert([{
                    serial_number: weddingData.serialNumber,
                    slug: weddingData.urlSlug,
                    partner1: weddingData.partner1,
                    partner2: weddingData.partner2,
                    wedding_date: weddingData.weddingDate,
                    venue: weddingData.venue,
                    city_state: weddingData.location,
                    love_story: weddingData.loveStory,
                    bridesmaids: weddingData.bridesmaids,
                    groomsmen: weddingData.groomsmen,
                    registry_links: weddingData.registry,
                    hotel_info: weddingData.hotelInfo,
                    rsvp_email: weddingData.rsvpEmail,
                    photos: weddingData.photos
                }])
                .select();
            
            if (error) throw error;
            
            // Generate URL using custom slug
            const weddingUrl = `template.html?slug=${weddingData.urlSlug}`;
            
            // Show confirmation page
            form.style.display = 'none';
            document.getElementById('preview-link').style.display = 'block';
            
            document.getElementById('preview-link').innerHTML = `
                <h3>Your wedding website is ready!</h3>
                <p style="font-size: 1.2rem; margin: 1rem 0;"><strong>Your Wedding Code:</strong> <span style="color: #C9A96E; font-size: 1.5rem;">${serialNumber}</span></p>
                <p style="margin: 1rem 0;"><a id="website-link" href="${weddingUrl}" target="_blank" style="color: #C9A96E; font-weight: 600; font-size: 1.2rem;">View your website →</a></p>
                
                <div style="margin-top: 2rem; padding: 1.5rem; background: #f9f9f9; border-radius: 8px;">
                    <h4 style="margin-bottom: 1rem;">Email these details to yourself</h4>
                    <form id="email-form" style="display: flex; flex-direction: column; gap: 1rem;">
                        <input type="email" id="email-input" placeholder="Enter your email address" required style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        <button type="submit" style="padding: 0.75rem; background-color: #C9A96E; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Send Email →</button>
                    </form>
                </div>
                
                <p style="margin-top: 1rem;"><small>Save this code to find your wedding later: <strong>${serialNumber}</strong></small></p>
                <p style="margin-top: 0.5rem;"><small>Your URL: desertlightweddings.com/${weddingUrl}</small></p>
            `;
            
            // Handle email form submission
            document.getElementById('email-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email-input').value;
                
                const emailSubject = encodeURIComponent('Your Wedding Website Details');
                const emailBody = encodeURIComponent(
                    `Your wedding website is ready!\n\n` +
                    `Wedding Code: ${serialNumber}\n` +
                    `Your Wedding URL: https://desertlightweddings.com/weddings/template.html?slug=${weddingData.urlSlug}\n` +
                    `Desert Light Weddings: https://desertlightweddings.com\n\n` +
                    `Save your wedding code (${serialNumber}) to find your wedding later on the site.\n\n` +
                    `Share your wedding website with guests: https://desertlightweddings.com/weddings/template.html?slug=${weddingData.urlSlug}`
                );
                
                window.location.href = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
            });
        } catch (error) {
            console.error('Error saving to Supabase:', error);
            alert('There was an error saving your wedding website: ' + error.message);
        }
    });
    
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});
