const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
}

const countTasks = () => {
    const localTasks = getTasksFromLocalStorage()
    const taskLength = localTasks.length;
    const taskChecked = localTasks.filter(({ concluido }) => concluido );
    const sumTaskchecked = taskChecked.length;

    const text = document.getElementById("goal-tasks");
    text.textContent = `${sumTaskchecked} concluídas`;
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

const createData = () => {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');      // Dia com duas casas
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês com duas casas (getMonth() começa do zero)
    const ano = dataAtual.getFullYear();                           // Ano completo
    // Formatar como "DD/MM/AAAA"
    const dataFormatada = `${dia}/${mes}/${ano}`;

    return dataFormatada;
}

const createTaskListItem = (task) => {
    const list = document.getElementById('taskList'); // UL
    const toDo = document.createElement('li'); // LI de cada Tarefa dentro da ul
    const descricao = document.createElement('h2') // h2 da descrição
    const data = document.createElement('p') // p element for date
    const conteudo = document.createElement('div'); // contem h2 e div 
    const dateLabel = document.createElement('div'); // vai conter a data e a etiqueta
    const label = document.createElement('div'); // nome da etiqueta

    //Montando 
    data.textContent = 'Criado em: ' + task.data; //montei a data
    label.textContent = task.label; //montei a etiqueta
    dateLabel.appendChild(label); //etiqueta na div 
    dateLabel.appendChild(data); //data na div

    descricao.textContent = task.description;

    //descrição do h2 e etiqueta dentro de outra div
    conteudo.appendChild(descricao); 
    conteudo.appendChild(dateLabel); 
    
    label.textContent = task.label;

    toDo.appendChild(conteudo);

    if(task.concluido){
        const img = document.createElement('img');
        img.src = './assets/checked.svg';
        img.classList.add('centralizaButton');
        descricao.classList.add('finished');
        toDo.appendChild(img);
    }else{
        const button = document.createElement('button');
        button.textContent = 'Concluir';
        button.classList.add('centralizaButton');

        button.onclick = () => removeTask(task.id); //modificar para mudar para o icone

        toDo.appendChild(button);
    }

    toDo.id = task.id;
    
    list.appendChild(toDo);

    return toDo;
}

const removeTask = (taskId) => {
    const li = document.getElementById(taskId); // Seleciona o li pelo ID
    const button = li.getElementsByTagName('button')[0]; // Acessa o primeiro botão (assumindo que existe apenas um)
    li.removeChild(button); // Remove o botão do li

    const descricao = li.getElementsByTagName('h2')[0];
    descricao.classList.add('finished');

    const img = document.createElement('img');
    img.src = './assets/checked.svg';
    img.classList.add('centralizaButton');
    li.appendChild(img);

    taskId--;
    const tasks = getTasksFromLocalStorage();
    tasks[taskId].concluido = true;

    setTasksInLocalStorage(tasks);

    countTasks();
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastid = tasks[tasks.length - 1]?.id;
    return lastid ? lastid + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.newTask.value;
    const label = event.target.elements.label.value;
    const id = getNewTaskId();
    const data = createData();

    return { description, label, data, id }
}

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event))
    }, 3000)
})

const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true);/** Desabilita o botão no evento assincrono */
    const newTaskdata = await getCreatedTaskInfo(event);

    createTaskListItem(newTaskdata)

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [
        ...tasks,
        { id: newTaskdata.id, description: newTaskdata.description, label: newTaskdata.label, data: newTaskdata.data, concluido: false } //fazer o parse?
    ]
    setTasksInLocalStorage(updatedTasks)
    document.getElementById('description').value = '';
    document.getElementById('label').value = '';
    document.getElementById('save-task').removeAttribute('disabled');

    countTasks();
}

window.onload = function() {
    const form = document.getElementById('form');
    form.addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage(); 

    tasks.forEach((task) => {
        createTaskListItem(task)
    })

    countTasks();
}