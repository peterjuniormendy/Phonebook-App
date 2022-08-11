// 1. Global Functions
import { contactsTable, contactForm } from './ui-elements.js';
import { fullName, phone, email, address } from "./form-elements.js"; 


export function  displayContacts(contacts = null) {
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
        <input class="form-check-input" type="checkbox" value="${index}" id="checkbox-${index}"  data-select-contact=${index}>
        
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
  
  
  
  
export function searchContacts(searchValue) {
  
  let contacts = getAllContacts();

  contacts = getAllContacts().filter((contact) => Object.values(contact).join(" ").includes(searchValue));
  
  /*
  contacts = contacts.filter(function(contact) { 
    
    return Object.values(contact).join(" ").includes(searchValue);

  });
  */

  displayContacts(contacts);  
}

/* Reset Form Fields */
export function resetForm() {  
  fullName.value = "";
  phone.value = "";
  email.value = "";
  address.value = "";

  // reset form errors
  contactForm.classList.remove('was-validated');

}

/* Hide Alert */
export function hideAlert(alert, duration = 5000) {
  setTimeout(() => {
    alert.classList.add('d-none');
  }, duration);
}

/* Get all Contacts from localStorage */
export function getAllContacts() {
  return JSON.parse(localStorage.getItem('phonebook'))  || [];
}