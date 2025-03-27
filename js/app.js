new Vue({
  el: "#app",
  data: {
    doctors: [], // All doctors
    searchTerm: "", // User input for search
    searchPerformed: false, // Tracks if a search was performed
    showAdvancedFilter: false, // Toggles advanced filter section
    filterOptions: {
      location: "All", // Default to "All"
      specialty: "All", // Default to "All"
    },
    formData: {
      doctorName: "",
      email: "",
      phone: "",
      location: "",
      specialty: "",
      experience: "",
      biography: "",
      picture: null,
    },
  },
  created() {
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

        const matchesLocation =
          this.filterOptions.location === "All" ||
          doctor.Location === this.filterOptions.location;
        const matchesSpecialty =
          this.filterOptions.specialty === "All" ||
          doctor.Specialty === this.filterOptions.specialty;

        return matchesSearch && matchesLocation && matchesSpecialty;
      });
    },
    featuredDoctors() {
      return [...this.doctors] // Avoid mutating original array
        .sort((a, b) => b.Rating - a.Rating)
        .slice(0, 3);
    },
    uniqueLocations() {
      const locations = [
        ...new Set(this.doctors.map((doctor) => doctor.Location)),
      ];
      return ["All", ...locations];
    },
    uniqueSpecialties() {
      const specialties = [
        ...new Set(this.doctors.map((doctor) => doctor.Specialty)),
      ];
      return ["All", ...specialties];
    },
  },
  methods: {
    toggleAdvancedFilter() {
      this.showAdvancedFilter = !this.showAdvancedFilter;
    },
    applyFilters() {
      this.searchPerformed = true;
    },
    clearFilters() {
      this.filterOptions.location = "All";
      this.filterOptions.specialty = "All";
      this.showAdvancedFilter = false;
    },
    performSearch() {
      this.searchPerformed = true;
    },
    handleImageUpload(event) {
      this.formData.picture = event.target.files[0];
    },
    submitForm() {
      console.log("Form Submitted", this.formData);
      window.location.href = "thank-you.html";
    },
  },
});
