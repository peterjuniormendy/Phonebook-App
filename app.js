// State Variables
import {
  displayContacts,
  searchContacts,
  getAllContacts,
  hideAlert,
  resetForm,
} from "./functions.js";

// Form Elements
import {
  fullName,
  phone,
  email,
  address,
  submitButton,
  processingButton,
} from "./form-elements.js";

// Contact UI Elements
import {
  newContactButton,
  contactForm,
  contactFormModalEl,
  contactFormModalTitleEl,
  deleteContactModalEl,
  deleteContactNameEl,
  searchContactInput,
  selectedContactsEl,
  selectedContactsCountEl,
  deleteContactsCountEl,
  deleteContactsModalEl,
  successAlert,
  infoAlert,
  dangerAlert,
  processDeleteButton,
  processingDeleteButton,
  processDeleteSelectedButton,
  processingDeleteSelectedButton,
} from "./ui-elements.js";

let contactState = "create";
let contactId = null;
let selectedContactsCount = 0;
let selectedContactIds = [];

// Instantiate Bootstrap Modals
const contactFormModal = new bootstrap.Modal(contactFormModalEl);
const deleteContactModal = new bootstrap.Modal(deleteContactModalEl);
const deleteContactsModal = new bootstrap.Modal(deleteContactsModalEl);

// display contacts table
displayContacts();

// 2. Event Listeners

searchContactInput.addEventListener("input", () =>
  searchContacts(searchContactInput.value)
);

/* Create Contact Modal - Listen for a click on the "New Contact", and then open the Contact Form Modal  */
newContactButton.addEventListener("click", () => contactFormModal.show());

/* Edit Contact Modal - Listen to a click on the body (whole web page), but check for clicks done on the Edit Buttons */
document.addEventListener("click", (event) => {
  // check if the click was actually done on an Edit Button
  if (event.target.getAttribute("data-edit-button")) {
    contactState = "edit";

    const editButton = event.target;

    contactId = editButton.id;

    let contacts = getAllContacts();
    let contact = contacts[editButton.id];

    fullName.value = contact.name;
    phone.value = contact.phone;
    email.value = contact.email;
    address.value = contact.address;

    contactFormModalTitleEl.textContent = "Edit Contact";

    contactFormModal.show();
  }

  if (event.target.getAttribute("data-delete-button")) {
    contactState = "delete";

    contactId = event.target.id;

    deleteContactNameEl.textContent = event.target.dataset.contactName;

    deleteContactModal.show();
  }

  if (event.target.getAttribute("data-select-contact")) {
    let checkboxEl = event.target;
    let checkboxes = document.querySelectorAll("[data-select-contact]");

    if (checkboxEl.value == "all") {
      if (checkboxEl.checked) {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
          selectedContactIds.push(checkbox.value);
        });
        selectedContactIds.shift();
        selectedContactsCount = checkboxes.length - 1;
      } else {
        checkboxes.forEach((checkbox) => (checkbox.checked = false));
        selectedContactsCount = 0;
        selectedContactIds = [];
      }
    } else {
      if (checkboxEl.checked) {
        selectedContactsCount++;
        selectedContactIds.push(checkboxEl.value);
      } else {
        selectedContactsCount--;
        selectedContactIds = selectedContactIds.filter(
          (selectedContactId) => selectedContactId != checkboxEl.value
        );
      }
    }

    if (selectedContactsCount) {
      selectedContactsCountEl.textContent = selectedContactsCount;
      selectedContactsEl.classList.remove("d-none");
    } else {
      selectedContactsCountEl.textContent = 0;
      selectedContactsEl.classList.add("d-none");
    }
  }
});

selectedContactsEl.addEventListener("click", (event) => {
  deleteContactsCountEl.textContent = selectedContactsCount;
  deleteContactsModal.show();
});

/* Save new contact */
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  submitButton.classList.add("d-none");
  processingButton.classList.remove("d-none");

  contactForm.classList.add("was-validated");

  if (!contactForm.checkValidity()) {
    submitButton.classList.remove("d-none");
    processingButton.classList.add("d-none");
    return;
  }

  setTimeout(() => {
    const contact = {
      name: fullName.value,
      phone: phone.value,
      email: email.value,
      address: address.value,
    };

    let contacts = getAllContacts();

    if (contactState == "edit") {
      let contactToEdit = contacts[contactId];

      contactToEdit.name = fullName.value;
      contactToEdit.phone = phone.value;
      contactToEdit.email = email.value;
      contactToEdit.address = address.value;

      contacts[contactId] = contactToEdit;
      infoAlert.classList.remove("d-none");
      hideAlert(infoAlert);
    } else {
      contacts.unshift(contact);
      successAlert.classList.remove("d-none");
      hideAlert(successAlert);
    }

    contacts = JSON.stringify(contacts);

    localStorage.setItem("phonebook", contacts);

    contactFormModal.hide();

    submitButton.classList.remove("d-none");
    processingButton.classList.add("d-none");

    displayContacts();
  }, 1500);
});

processDeleteButton.addEventListener("click", () => {
  processDeleteButton.classList.add("d-none");
  processingDeleteButton.classList.remove("d-none");

  setTimeout(() => {
    let contacts = getAllContacts();
    contacts.splice(contactId, 1);

    contacts = JSON.stringify(contacts);
    localStorage.setItem("phonebook", contacts);

    processDeleteButton.classList.remove("d-none");
    processingDeleteButton.classList.add("d-none");

    deleteContactModal.hide();

    displayContacts();

    dangerAlert.classList.remove("d-none");
    hideAlert(dangerAlert);
  }, 1000);
});
processDeleteSelectedButton.addEventListener("click", () => {
  processDeleteSelectedButton.classList.add("d-none");
  processingDeleteSelectedButton.classList.remove("d-none");

  setTimeout(() => {
    let contacts = getAllContacts();

    contacts = contacts.filter((contact, index) => {
      return !selectedContactIds.includes(String(index));
    });

    contacts = JSON.stringify(contacts);

    localStorage.setItem("phonebook", contacts);

    processDeleteSelectedButton.classList.remove("d-none");
    processingDeleteSelectedButton.classList.add("d-none");

    deleteContactsModal.hide();
    selectedContactsEl.classList.add("d-none");
    selectedContactsCount = 0;
    selectedContactIds = [];

    displayContacts();

    dangerAlert.classList.remove("d-none");
    hideAlert(dangerAlert);
  }, 1000);
});

/*  Listen to when the contact modal is hidden, and then perform some clean-up operations */
contactFormModalEl.addEventListener("hide.bs.modal", (event) => {
  contactState = "create";
  contactFormModalTitleEl.textContent = "New Contact";
  resetForm();
});
