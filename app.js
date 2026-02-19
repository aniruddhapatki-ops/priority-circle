class Contact {
    constructor(name, phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
}

class PriorityContactsManager {
    constructor() {
        this.contacts = this.loadContacts();
    }

    loadContacts() {
        const contactsJSON = localStorage.getItem('priorityContacts');
        return contactsJSON ? JSON.parse(contactsJSON) : [];
    }

    saveContacts() {
        localStorage.setItem('priorityContacts', JSON.stringify(this.contacts));
    }

    addContact(name, phoneNumber) {
        this.contacts.push(new Contact(name, phoneNumber));
        this.saveContacts();
    }

    updateContact(index, name, phoneNumber) {
        if (this.contacts[index]) {
            this.contacts[index].name = name;
            this.contacts[index].phoneNumber = phoneNumber;
            this.saveContacts();
        }
    }

    deleteContact(index) {
        this.contacts.splice(index, 1);
        this.saveContacts();
    }

    searchContact(query) {
        return this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    exportContacts() {
        const csvContent = this.contacts.map(contact => 
            `${contact.name},${contact.phoneNumber}`).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'contacts.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    importContacts(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            lines.forEach(line => {
                const [name, phoneNumber] = line.split(',');
                if (name && phoneNumber) {
                    this.addContact(name, phoneNumber);
                }
            });
        };
        reader.readAsText(file);
    }

    callContact(phoneNumber) {
        window.location.href = `tel:${phoneNumber}`;
    }

    smsContact(phoneNumber) {
        window.location.href = `sms:${phoneNumber}`;
    }

    whatsappContact(phoneNumber) {
        window.open(`https://wa.me/${phoneNumber}`);
    }

    getContactStatistics() {
        return {
            totalContacts: this.contacts.length,
        };
    }
}

// Example usage
const contactManager = new PriorityContactsManager();
contactManager.addContact('John Doe', '1234567890'); // Example contact
