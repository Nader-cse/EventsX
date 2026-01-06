"use strict";

class EventManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.events = [
      { name: "Tech Conference 2026", date: "2026-02-15", location: "Cairo", price: 1200, category: "tech" },
      { name: "Music Festival", date: "2026-03-10", location: "Alexandria", price: 800, category: "music" },
      { name: "Startup Meetup", date: "2026-01-25", location: "Giza", price: 300, category: "tech" },
      { name: "Music Concert", date: "2026-02-10", location: "Cairo", price: 50, category: "music" },
      { name: "Art Exhibition", date: "2026-02-15", location: "Cairo", price: 20, category: "art" },
      { name: "Football Match", date: "2026-02-20", location: "Cairo", price: 30, category: "sports" }
    ];
    if (this.container) this.renderEvents(this.events);
  }

  renderEvents(eventsList) {
    if (!this.container) return;
    this.container.innerHTML = "";
    eventsList.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <h3>${event.name}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Price:</strong> ${event.price} EGP</p>
      `;
      this.container.appendChild(card);
    });
  }

  // Improved filter to handle Name, Category, and Location
  filterEvents(nameKey, categoryKey, locationKey) {
    const filtered = this.events.filter(e => {
      const matchesName = e.name.toLowerCase().includes(nameKey.toLowerCase());
      const matchesCategory = categoryKey === "" || e.category === categoryKey;
      const matchesLocation = e.location.toLowerCase().includes(locationKey.toLowerCase());
      return matchesName && matchesCategory && matchesLocation;
    });
    this.renderEvents(filtered);
    // console.log(name)
  }
}

class BudgetCalculator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (this.form) this.form.addEventListener("submit", this.calculate.bind(this));
  }

  calculate(event) {
    event.preventDefault();
    const ticketPrice = Number(document.getElementById("tickets")?.value || 0);
    const quantity = Number(document.getElementById("quantity")?.value || 0);
    const travel = Number(document.getElementById("travel")?.value || 0);
    const accommodation = Number(document.getElementById("accommodation")?.value || 0);
    
    const total = (ticketPrice * quantity) + travel + accommodation;
    const resultDisplay = document.getElementById("total-cost");
    if (resultDisplay) resultDisplay.textContent = total.toFixed(2);
    
    document.dispatchEvent(new CustomEvent("budgetCalculated", { detail: total }));
  }
}

class RegistrationForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (this.form) this.form.addEventListener("submit", this.validate.bind(this));
  }

  validate(event) {
    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const selectedEvent = document.getElementById("event-select").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!name || !email || !phone || !selectedEvent) {
      event.preventDefault(); // STOP the redirect
      alert("Please fill all fields");
      return;
    }

    if (!emailPattern.test(email)) {
      event.preventDefault();
      alert("Invalid email format");
      return;
    }

    if (!phonePattern.test(phone)) {
      event.preventDefault();
      alert("Phone number must be 10 digits");
      return;
    }

    // If validation passes, the form will submit to thank-you.html automatically
    document.dispatchEvent(new Event("userRegistered"));
  }
}

class ParallaxController {
  constructor(selector) {
    this.section = document.querySelector(selector);
    if (this.section) window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const offset = window.pageYOffset;
    this.section.style.backgroundPositionY = offset * 0.5 + "px";
  }
}

// ======================= DOMContentLoaded =======================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize each class ONLY ONCE
  const eventMgr = new EventManager("upcoming-events");
  new BudgetCalculator("budget-form");
  new RegistrationForm("registration-form");
  new ParallaxController(".hero");

  // Filter functionality
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("search-name").value;
      const category = document.getElementById("filter-category").value;
      const location = document.getElementById("filter-location").value;
      
      eventMgr.filterEvents(name, category, location);
    });
  }
});