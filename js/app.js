new Vue({
    el: "#app",
    data: {
        doctors: [], // All doctors
        searchTerm: "", // User input for search
        searchPerformed: false, // Tracks if a search was performed
        showAdvancedFilter: false, // Toggles advanced filter section
        filterOptions: {
            location: "", // Selected location filter
            specialty: "" // Selected specialty filter
        },
        formData: {
            doctorName: '',
            email: '',
            phone: '',
            location: '',
            specialty: '',
            experience: '',
            biography: '',
            picture: null,
        },
    },
    created() {
        // Fetch doctor data
        fetch("doctors.json")
            .then((response) => response.json())
            .then((data) => {
                this.doctors = data;
            })
            .catch((error) => console.error("Error fetching doctor data:", error));
    },
    computed: {
        filteredDoctors() {
            const term = this.searchTerm.toLowerCase();
            return this.doctors.filter((doctor) => {
                const matchesSearch = 
                    doctor["Doctor Name"].toLowerCase().includes(term) ||
                    doctor.Specialty.toLowerCase().includes(term) ||
                    doctor.Location.toLowerCase().includes(term);
    
                // If "All" is selected, skip location filter
                const matchesLocation = this.filterOptions.location && this.filterOptions.location !== "All" 
                    ? doctor.Location === this.filterOptions.location 
                    : true;
    
                const matchesSpecialty = this.filterOptions.specialty 
                    ? doctor.Specialty === this.filterOptions.specialty 
                    : true;
    
                return matchesSearch && matchesLocation && matchesSpecialty;
            });
        },
        //featured doctors function that returns the first 3 doctors with the highest ratings
        featuredDoctors() {
            return this.doctors
                .sort((a, b) => b.Rating - a.Rating)
                .slice(0, 3);
        },
        uniqueLocations() {
            const locations = [...new Set(this.filteredDoctors.map((doctor) => doctor.Location))];
            // Always return locations including "All"
            return ['All', ...locations];
        },
        uniqueSpecialties() {
            const specialties = [...new Set(this.filteredDoctors.map((doctor) => doctor.Specialty))];
            console.log('Unique Specialties:', specialties);
            return ['All', ...specialties]; // Add "All Specialties" to the beginning
        }
    },
    methods: {
        toggleAdvancedFilter() {
            this.showAdvancedFilter = !this.showAdvancedFilter;
            console.log('Advanced filter toggled:', this.showAdvancedFilter);
        },
        applyFilters() {
            this.searchPerformed = true; // Indicate a search was performed
        },
        clearFilters() {
            // Reset filter options and hide advanced filters
            this.filterOptions.location = "";
            this.filterOptions.specialty = "";
            this.showAdvancedFilter = false;
        },
        performSearch() {
            this.searchPerformed = true; // Indicate a search was performed
            console.log('Search performed:', this.searchTerm);
        },
        handleImageUpload(event) {
            this.formData.picture = event.target.files[0];
        },
        submitForm() {
            // Example of form submission logic
            console.log('Form Submitted', this.formData);
            // Add AJAX request to submit form data to the server or API here
            window.location.href = 'thank-you.html';
        },
        
    },
    mounted() {
        // Initialize Materialize Select
        this.$nextTick(() => {
            M.FormSelect.init(document.querySelectorAll('select'));
            M.Sidenav.init(document.querySelectorAll('.sidenav'));
        });
    },
    watch: {
        filterOptions: {
            handler() {
                this.$nextTick(() => {
                    M.FormSelect.init(document.querySelectorAll('select'));
                });
            },
            deep: true
        }
    }
});