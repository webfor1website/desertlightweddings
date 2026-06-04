// Wedding Website Generator

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wedding-form');
    const photoUpload = document.getElementById('photo-upload');
    const photoInput = document.getElementById('photos');
    const photoPreview = document.getElementById('photo-preview');
    
    let uploadedPhotos = [];
    
    // Photo upload handling
    photoUpload.addEventListener('click', function() {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files).slice(0, 5);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedPhotos.push(e.target.result);
                updatePhotoPreview();
            };
            reader.readAsDataURL(file);
        });
    });
    
    function updatePhotoPreview() {
        photoPreview.innerHTML = uploadedPhotos.map((photo, index) => 
            `<img src="${photo}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px;">`
        ).join('');
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const weddingData = {
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
            urlSlug: document.getElementById('url-slug').value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
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
                weddingData.registry.push(input.value.trim());
            }
        });
        
        // Save to localStorage
        localStorage.setItem('weddingData', JSON.stringify(weddingData));
        
        // Generate URL
        const weddingUrl = `weddings/${weddingData.urlSlug}.html`;
        
        // Show preview link
        document.getElementById('preview-link').style.display = 'block';
        document.getElementById('website-link').href = weddingUrl;
        
        // In a real implementation, this would generate the actual HTML file
        // For now, we'll redirect to the template with the data
        alert('Your wedding website has been created! Click the link below to view it.');
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
