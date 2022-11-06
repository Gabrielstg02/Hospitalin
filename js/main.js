let DB;

let form = document.querySelector('form');
let patientName = document.querySelector('#patient-name');
let contact = document.querySelector('#contact');
let date = document.querySelector('#date');
let time = document.querySelector('#time');
let symptoms = document.querySelector('#symptoms');
let consultations = document.querySelector('#consultations');
let services = document.querySelector('#services');
let doctor = document.querySelector('#doctor');
let departement = document.querySelector('#departement');


document.addEventListener('DOMContentLoaded', () => {
     // create the database
    let ScheduleDB = window.indexedDB.open('consultations', 1);

     // if there's an error
    ScheduleDB.onerror = function() {
        console.log('error');
    }
     // if everything is fine, assign the result is to the (letDB) instance 
    ScheduleDB.onsuccess = function() {
          // console.log('Database Ready');
        DB = ScheduleDB.result;

        showConsultations();
    }

    ScheduleDB.onupgradeneeded = function(e) {
        
        let db = e.target.result;
        
        let objectStore = db.createObjectStore('consultations', { keyPath: 'key', autoIncrement: true } );

        objectStore.createIndex('departement', 'departement', { unique: false } );
        objectStore.createIndex('doctor', 'doctor', { unique: false } );
        objectStore.createIndex('patientname', 'patientname', { unique: false } );
        objectStore.createIndex('contact', 'contact', { unique: false } );
        objectStore.createIndex('date', 'date', { unique: false } );
        objectStore.createIndex('time', 'time', { unique: false } );
        objectStore.createIndex('symptoms', 'symptoms', { unique: false } );

          //console.log('Database ready and fields created!');
    }

    form.addEventListener('submit', addConsultations);

    function addConsultations(e) {
        e.preventDefault();
        let newConsultation = {
            departement : departement.value,
            doctor : doctor.value,
            patientname : patientName.value,
            contact : contact.value,
            date : date.value,
            time : time.value,
            symptoms : symptoms.value
        }
        let transaction = DB.transaction(['consultations'], 'readwrite');
        let objectStore = transaction.objectStore('consultations');

        let request = objectStore.add(newConsultation);
            request.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
        //console.log('New schedule added');

            showConsultations();
        }
        transaction.onerror = () => {
            //console.log();
        }

    }
    function showConsultations() {
        while(consultations.firstChild) {
            consultations.removeChild(consultations.firstChild);
        }

        let objectStore = DB.transaction('consultations').objectStore('consultations');
        
        objectStore.openCursor().onsuccess = function(e) {
        
            let cursor = e.target.result;
            if(cursor) {
                let ConsultationHTML = document.createElement('li');
                ConsultationHTML.setAttribute('data-consultation-id', cursor.value.key);
                ConsultationHTML.classList.add('list-group-item');

                ConsultationHTML.innerHTML = `
                <p class="fw-bold">Department:  <span class="fw-normal">Department ${cursor.value.departement}<span></p>
                <p class="fw-bold">Doctor:  <span class="fw-normal">Doctor ${cursor.value.doctor}<span></p>
                <p class="fw-bold">Patient Name:  <span class="fw-normal">${cursor.value.patientname}<span></p>
                <p class="fw-bold">Contact:  <span class="fw-normal">${cursor.value.contact}<span></p>
                <p class="fw-bold">Date:  <span class="fw-normal">${cursor.value.date}<span></p>
                <p class="fw-bold">Time:  <span class="fw-normal">${cursor.value.time}<span></p>
                <p class="fw-bold">Symptoms:  <span class="fw-normal">${cursor.value.symptoms}<span></p>
                `;

                const cancelBtn = document.createElement('button');
                cancelBtn.classList.add('btn', 'btn-danger');
                cancelBtn.innerHTML = 'Cancel';
                cancelBtn.onclick = removeConsultation;

                ConsultationHTML.appendChild(cancelBtn);
                consultations.appendChild(ConsultationHTML);

                cursor.continue();

            } else {
                if(!consultations.firstChild) {
                    services.textContent = 'Your Appointment Summary';
                    let noSchedule = document.createElement('p');
                    noSchedule.classList.add('text-center');
                    noSchedule.textContent = 'No Appointment Yet';
                    consultations.appendChild(noSchedule);
                } else {
                    services.textContent = 'Cancel Your Consultations'
                }
            }
        }
    }

    function removeConsultation(e) {
        let scheduleID = Number( e.target.parentElement.getAttribute('data-consultation-id') );
        
        let transaction = DB.transaction(['consultations'], 'readwrite');
        let objectStore = transaction.objectStore('consultations');
        
        objectStore.delete(scheduleID);

        transaction.oncomplete = () => {
            e.target.parentElement.parentElement.removeChild( e.target.parentElement );

            if(!consultations.firstChild) {
                services.textContent = 'Your Appointment Summary';
                let noSchedule = document.createElement('p');
                noSchedule.classList.add('text-center');
                noSchedule.textContent = 'No Appointment Yet';
                consultations.appendChild(noSchedule);
            } else {
                services.textContent = 'Cancel Your Consultation'
            }
        }
    }
});

(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });

    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // Team carousel
    $(".team-carousel, .related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });
    
})(jQuery);
