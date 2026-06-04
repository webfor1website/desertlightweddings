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
    form.addEventListener('submit', function(e) {
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
        
        // Save to localStorage with serial number as key
        try {
            localStorage.setItem('wedding_' + serialNumber, JSON.stringify(weddingData));
            
            // Also save by slug for direct URL access
            localStorage.setItem('wedding_slug_' + weddingData.urlSlug, serialNumber);
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please try uploading fewer or smaller photos, or clear your browser\'s local storage.');
                return;
            }
            throw e;
        }
        
        // Generate URL
        const weddingUrl = `template.html?code=${serialNumber}`;
        
        // Show confirmation page
        form.style.display = 'none';
        document.getElementById('preview-link').style.display = 'block';
        document.getElementById('preview-link').innerHTML = `
            <h3>Your wedding website is ready!</h3>
            <p style="font-size: 1.2rem; margin: 1rem 0;"><strong>Your Wedding Code:</strong> <span style="color: #C9A96E; font-size: 1.5rem;">${serialNumber}</span></p>
            <p style="margin: 1rem 0;"><a id="website-link" href="${weddingUrl}" target="_blank" style="color: #C9A96E; font-weight: 600; font-size: 1.2rem;">View your website →</a></p>
            <p style="margin-top: 1rem;"><small>Save this code to find your wedding later: <strong>${serialNumber}</strong></small></p>
            <p style="margin-top: 0.5rem;"><small>Your URL: desertlightweddings.com/${weddingUrl}</small></p>
        `;
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
