// State Variables
let contactState = "create";
let contactId = null;

// Contact UI Elements
const newContactButton = document.querySelector('#create-contact-button')
const contactForm = document.querySelector('#contact-form');
const contactsTable = document.querySelector('#contacts-table')
const contactFormModalEl = document.querySelector('#contact-form-modal');
const contactFormModalTitleEl = document.querySelector('.modal-title');
const deleteContactModalEl = document.querySelector('#delete-contact-modal');
const deleteContactNameEl = document.querySelector('#delete-contact-name');
const searchContactInput = document.querySelector('#search-contact-input');

// Instantiate Bootstrap Modals
const contactFormModal = new bootstrap.Modal(contactFormModalEl);
const deleteContactModal = new bootstrap.Modal(deleteContactModalEl);

// Alerts
const successAlert = document.querySelector('#success-alert');
const infoAlert = document.querySelector('#info-alert');
const dangerAlert = document.querySelector('#danger-alert');


// Form Input Fields
const fullName = document.querySelector("#name");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");
const address = document.querySelector("#address");

// Form Buttons
const submitButton = document.querySelector('#submit');
const processingButton = document.querySelector('#processing');
const processDeleteButton = document.querySelector('#process-delete-button');
const processingDeleteButton = document.querySelector('#processing-delete-button');


// Fetch current contacts from localStorage
displayContacts();



// 1. Global Functions

/* Display contacts on Contacts UI Table */
function displayContacts(contacts = null) {
  const loadingState = `<tr>
              <td colspan="6">
                <!-- <div class="py-5 text-center">
                  Loading Contacts...
                </div> -->
                <div class="d-flex justify-content-center align-items-center"
                  style="padding-top: 5rem; padding-bottom: 5rem;">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>`;
  
  contactsTable.querySelector('tbody').innerHTML = loadingState;
  
  setTimeout(() => {

  contacts = contacts || JSON.parse(localStorage.getItem('phonebook'));
  
  let emptyRows = "";
  if (!contacts || contacts.length == 0) {
    emptyRows = `
      <tr>
        <td colspan="6">
          <div class="text-center" style="padding-top: 5rem; padding-bottom: 5rem">No contacts!</div>
        </td>
      </tr>
    `

    
    contactsTable.querySelector('tbody').innerHTML = emptyRows;
    return;
  }

  document.querySelector('#all-contacts-count').textContent = contacts.length;
  let contactsData = "";
  contacts.forEach((contact, index) => {

  
    contactsData += `<tr>
    <td>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${index}" id="checkbox-${index}">
        <!-- <label class="form-check-label" for="checkbox-${index}">
          ${index + 1}
        </label> -->
      </div>
    </td>
    <th scope="row">${contact.name}</th>
    <td>${contact.phone}</td>
    <td>${contact.email}</td>
    <td>${contact.address}</td>
    <td>
      <div class="d-flex align-items-center space-x-2">
        <button class="btn btn-info" id="${index}" data-edit-button="${index}">Edit</button>
        <button class="btn btn-danger" data-delete-button="${index}" data-contact-name="${contact.name}">Delete</button>
      </div>
    </td>
  </tr>`;

})

  contactsTable.querySelector('tbody').innerHTML = contactsData;
  }, 500)
  
}





function searchContacts(searchValue) {
  console.log(searchValue);
  let contacts = getAllContacts();

  contacts = contacts.filter(function(contact) { 
    // console.log(JSON.stringify(Object.values(contact)));
    console.log((Object.values(contact).join(" ")));
    return Object.values(contact).join(" ").includes(searchValue);

  });

  // console.log(contacts)
  displayContacts(contacts);  
}

/* Reset Form Fields */
function resetForm() {  
  fullName.value = "";
  phone.value = "";
  email.value = "";
  address.value = "";

  // reset form errors
  contactForm.classList.remove('was-validated');

}

/* Hide Alert */
function hideAlert(alert, duration = 5000) {
  setTimeout(() => {
    alert.classList.add('d-none');
  }, duration);
}

/* Get all Contacts from localStorage */
function getAllContacts() {
  return JSON.parse(localStorage.getItem('phonebook'))  || [];
}

// 2. Event Listeners

searchContactInput.addEventListener('input', () => {
  // console.log('searching..');
  searchContacts(searchContactInput.value);
});

/* Create Contact Modal - Listen for a click on the "New Contact", and then open the Contact Form Modal  */
newContactButton.addEventListener('click', () => {
  contactFormModal.show();
});

/* Edit Contact Modal - Listen to a click on the body (whole web page), but check for clicks done on the Edit Buttons */
document.addEventListener('click', (event) => {

  // check if the click was actually done on an Edit Button
  if (event.target.getAttribute('data-edit-button')) {
    
    contactState = 'edit';

    const editButton = event.target;
    
    contactId = editButton.id;

    let contacts =  JSON.parse(localStorage.getItem('phonebook'));
    let contact = contacts[editButton.id];

    fullName.value = contact.name;
    phone.value = contact.phone;
    email.value = contact.email;
    address.value = contact.address;

    contactFormModalTitleEl.textContent = 'Edit Contact';

    contactFormModal.show();

  }

  if (event.target.getAttribute('data-delete-button')) {
    
    contactState = 'delete';
    
    contactId = event.target.id;
    
    deleteContactNameEl.textContent = event.target.dataset.contactName;

    deleteContactModal.show();

  }
});

/* Save new contact */
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  submitButton.classList.add('d-none');
  processingButton.classList.remove('d-none');

  contactForm.classList.add('was-validated');

  if (!contactForm.checkValidity()) {
    submitButton.classList.remove('d-none');
    processingButton.classList.add('d-none');
    return;
  }

  setTimeout(() => {
    const contact = {
      name: fullName.value,
      phone: phone.value,
      email: email.value,
      address: address.value
    }
  
    let contacts = localStorage.getItem('phonebook');

    contacts = JSON.parse(contacts);

    if (!contacts) {
      contacts = [];
    }

    if (contactState == 'edit') {

      let contactToEdit = contacts[contactId];

      contactToEdit.name = fullName.value;
      contactToEdit.phone = phone.value;
      contactToEdit.email = email.value;
      contactToEdit.address = address.value;

      contacts[contactId] = contactToEdit;
      
    } else {
      contacts.unshift(contact);
    }

    contacts = JSON.stringify(contacts);

    localStorage.setItem('phonebook', contacts);

    
    if (contactState == 'edit') {
      infoAlert.classList.remove('d-none');
      hideAlert(infoAlert);
    } else {
      successAlert.classList.remove('d-none');
      hideAlert(successAlert);
    }

    contactFormModal.hide();

    submitButton.classList.remove('d-none');
    processingButton.classList.add('d-none');

    displayContacts();
  }, 1500)

})

processDeleteButton.addEventListener('click', () => {
  
  processDeleteButton.classList.add('d-none');
  processingDeleteButton.classList.remove('d-none');

  setTimeout(() => {

    let contacts = localStorage.getItem('phonebook');

    contacts = JSON.parse(contacts);

    contacts.splice(contactId, 1);

    contacts = JSON.stringify(contacts);

    localStorage.setItem('phonebook', contacts);

    processDeleteButton.classList.remove('d-none');
    processingDeleteButton.classList.add('d-none');


    deleteContactModal.hide();

    displayContacts();
    
    dangerAlert.classList.remove('d-none');
    hideAlert(dangerAlert);
    
  }, 1000);
});

/*  Listen to when the contact modal is hidden, and then perform some clean-up operations */
contactFormModalEl.addEventListener('hide.bs.modal', event => {
  contactState = "create";
  contactFormModalTitleEl.textContent = 'New Contact';
  resetForm();
})