const itemSection = document.querySelector('.list');
const itemForm = document.forms['item-form'];
const itemInputElement = itemForm.querySelector('.form__input');
const cardTemplate = document
    .querySelector('.card-template')
    .content.querySelector('.list__item');

let items = [];

if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
    items.forEach((item) => renderTask(item));
}

itemForm.addEventListener('submit', handleSubmitForm);
itemSection.addEventListener('click', doneTask);


function handleDeleteCard(item) {
    item.remove();
}

function handleEditItem(itemNameElement) {
    itemNameElement.setAttribute('contenteditable', 'true');
    itemNameElement.focus();
}

function createItem(itemName) {
    const newItem = cardTemplate.cloneNode(true);
    const itemNameElement = newItem.querySelector('.item__text');
    itemNameElement.textContent = itemName;

    const deleteButton = newItem.querySelector('.delete');
    deleteButton.addEventListener('click', () => handleDeleteCard(newItem));

    const editButton = newItem.querySelector('.edit');
    editButton.addEventListener('click', () => handleEditItem(itemNameElement));

    itemNameElement.addEventListener('blur', () => {
        itemNameElement.removeAttribute('contenteditable');
    });

    return newItem;
}

function addElement(element) {
    itemSection.prepend(element);
}


function handleSubmitForm(evt) {
    evt.preventDefault();

    const newTask = {
        id: Date.now(),
        text: itemInputElement.value,
        done: false,
    };

    items.push(newTask);
    saveToLocalStorage();
    renderTask(newTask);

    itemInputElement.value = '';
    itemInputElement.focus();
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list__item');
    const id = Number(parentNode.id);
    const item = items.find((item) => item.id === id);

    item.done = true;
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.item__text');
    taskTitle.classList.add('item__text_line-through');
}


function saveToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}

function renderTask(item) {
    let taskHTML = createItem(itemInputElement.value);

    itemInputElement.value = `${item.text}`;
    taskHTML = createItem(itemInputElement.value);
    itemInputElement.value = '';
    taskHTML.setAttribute('id', `${item.id}`);

    if (item.done === true) {
        taskHTML.classList.add('item__text_line-through');
    }

    addElement(taskHTML);
}