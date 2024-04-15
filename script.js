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
    const itemNameElement = newItem.querySelector('.list__item_text');
    itemNameElement.textContent = itemName;
    newItem.setAttribute("draggable", "true");

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

    const taskTitle = parentNode.querySelector('.list__item_text');
    taskTitle.classList.add('list__item_text-line-through');
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
        taskHTML.classList.add('list__item_text-line-through');
    }

    addElement(taskHTML);
}

const draggables = document.querySelectorAll('.list__item');
let positionObj = { offset: Number.NEGATIVE_INFINITY }

function distanceBetweenItems(item, droppedPosition) {
    const rect = item.getBoundingClientRect();
    return (droppedPosition - (rect.top + rect.height / 2));
}

draggables.forEach(item => {

    item.addEventListener('dragstart', (event) => {
        event.target.classList.add('selected');
    })

    item.addEventListener('dragend', (event) => {
        event.target.classList.remove('selected');
    })
})

itemSection.addEventListener('dragover', (event) => {
    event.preventDefault();
})

itemSection.addEventListener('drop', (event) => {
    event.preventDefault();

    const newDraggables = Array.from(document.querySelectorAll('.list__item:not(.selected'));
    positionObj = { offset: Number.NEGATIVE_INFINITY }
    newDraggables.forEach(item => {
        let offset = distanceBetweenItems(item, event.clientY);

        if (offset < 0 && offset > positionObj.offset) {
            positionObj.offset = offset;
            positionObj.element = item;
        }
    })
    const selected = document.querySelector('.selected');
    itemSection.insertBefore(selected, positionObj.element)

})