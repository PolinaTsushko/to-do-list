const items = [
    'Погулять с Эйприл',
    'Сходить на занятие к Сплинтеру',
    'Заказать пиццу',
];

const cardTemplate = document
    .querySelector('.card-template')
    .content.querySelector('.list__item');

const itemSection = document.querySelector('.list');
const itemForm = document.forms['item-form'];
const itemInputElement = itemForm.querySelector('.form__input');

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

items.forEach((item) => {
    addElement(createItem(item));
});

function handleSubmitForm(evt) {
    evt.preventDefault();
    addElement(createItem(itemInputElement.value));
    itemInputElement.value = '';
}

itemForm.addEventListener('submit', handleSubmitForm);


itemSection.addEventListener('click', doneTask);

function doneTask(event) {
    if (event.target.dataset.action === 'done') {

        const parentNode = event.target.closest('.list__item');
        const taskTitle = parentNode.querySelector('.item__text');
        taskTitle.classList.toggle('item__text_line-through');
    };
}